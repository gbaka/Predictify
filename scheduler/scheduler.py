"""
Модуль реализует асинхронный планировщик задач для выполнения ETL-процессов (parse + predict + load)
в отдельных процессах с использованием пула процессов.

Функции планировщика:
- Периодический запуск задач из конфигурационного файла
- Парсинг новых данных
- Обновление фактических значений в БД
- Построение и сохранение прогнозов
"""

import asyncio
import traceback
from concurrent.futures import ProcessPoolExecutor
from typing import Dict, List
from datetime import datetime

from sqlalchemy import desc

from database.crud import get_crud_for_table
from database import get_db_session
from services.parsers import parse
from services.forecasting import forecast
from logger import Logger


logger = Logger(name='scheduler', log_dir='logs', log_file='scheduler.log').get_logger()


class Scheduler:
    """
    Планировщик задач, запускающий задачи в фоне с использованием пула процессов.

    Attributes:
        tasks_config (List[Dict]): Список конфигураций задач
        process_pool (PoolExecutor): Пул для задач
        _running_tasks (List[asyncio.Task]): Активные фоновые задачи
        _shutdown_event (asyncio.Event): Сигнал для завершения задач
    """

    def __init__(self, tasks_config: List[Dict], process_pool: ProcessPoolExecutor):
        """
        Args:
            tasks_config: Конфигурация задач с параметрами источника, модели и расписания.
            process_pool: Пул процессов для параллельного выполнения задач.
        """
        self.tasks_config = tasks_config
        self.process_pool = process_pool
        self._running_tasks = []
        self._shutdown_event = asyncio.Event()

    async def start(self):
        """
        Асинхронный запуск всех задач, указанных в конфигурации.

        Запускает каждую задачу в отдельной корутине, которая периодически инициирует процесс обработки.
        """
        logger.info(f"🚀 Starting scheduler with {len(self.tasks_config)} tasks")

        for task_config in self.tasks_config:
            task = asyncio.create_task(
                self._process_task_wrapper(task_config)
            )
            self._running_tasks.append(task)

        logger.info("✅ All tasks running in background")

    async def _process_task_wrapper(self, task_config: Dict):
        """
        Обертка для безопасного выполнения задачи по расписанию.

        Задача запускается через пул процессов (или другой) с учетом интервала запуска. 
        В случае ошибки — логирует исключение и делает повторную попытку после задержки.

        Args:
            task_config: Конфигурация конкретной задачи.
        """
        loop = asyncio.get_running_loop()

        while not self._shutdown_event.is_set():
            try:
                start_time = loop.time()
                await loop.run_in_executor(
                    self.process_pool,
                    self._process_task,
                    task_config
                )    
                execution_time = loop.time() - start_time
                sleep_time = max(0, task_config['schedule']['pooling_interval'] - execution_time)
                await asyncio.sleep(sleep_time)

            except Exception as e:
                logger.info(f"⚠️ Task '{task_config['name']}' failed: {str(e)}")
                logger.info(traceback.format_exc())
                logger.info(f"🔄 Retrying in {task_config['schedule']['retry_cooldown']}s...")
                await asyncio.sleep(task_config['schedule']['retry_cooldown'])

    @staticmethod
    def _process_task(task_config: Dict) -> bool:
        """
        Основная логика выполнения задачи: парсинг новых данных, обновление БД, построение прогноза.

        Args:
            task_config: Конфигурация задачи, содержащая настройки парсера, модели и источника данных.

        Returns:
            bool: True, если задача успешно выполнена.

        Raises:
            ValueError: Если недостаточно данных для обучения модели или произошла ошибка во время выполнения.
        """
        logger.info(f"\n{'='*50}")
        logger.info(f"🔧 Starting task: {task_config['name']} ({datetime.now().strftime('%Y-%m-%d %H:%M:%S')})")
        logger.info(f"📌 Table: {task_config['database']['tablename']}")
        logger.info(f"🔮 Model: {task_config['model']['type']}")
        logger.info(f"{'='*50}")

        session_generator = get_db_session() # Генератор должен жить все время работы функции, после выхода из области видимости сгенерится GeneratorExit и соединение закроется

        try:
            # Открываем сессию БД 
            db_session = next(session_generator)

            # Получаем дату для последнего ненулевого endog из БД
            tablename = task_config['database']['tablename']
            crud = get_crud_for_table(tablename)
            last_observation = (
                db_session.query(crud.model)
                .filter(crud.model.endog.isnot(None))
                .order_by(desc(crud.model.date))
                .first()
            )
            last_obs_date = last_observation.date if last_observation else None
            logger.info(f"\n📅 Last observation date in DB: {last_obs_date or 'No data'}")

            # Парсим новые наблюдаемые данные
            logger.info("\n🔄 Fetching new data from source...")
            parsed_data = parse(
                parser_type=task_config['parser']['type'],
                params=task_config['parser']['params']
            )
            logger.info(f"✅ Received {len(parsed_data['dates'])} data points")
            logger.info(f"📆 Date range: {parsed_data['dates'][0]} to {parsed_data['dates'][-1]}")

            # Фильтруем напарсенные данные и вычисляем ошибки для старых прогнозов
            updated_forecasts = 0
            new_observations = []
            for i, date in enumerate(parsed_data["dates"]):
                if not last_obs_date or date > last_obs_date:
                    existing_record = db_session.query(crud.model)\
                                    .filter(crud.model.date == date)\
                                    .first()       
                    if existing_record and existing_record.predict is not None:
                        existing_record.endog = parsed_data["endog"][i]
                        if parsed_data["endog"][i] is not None:
                            existing_record.absolute_error = abs(parsed_data["endog"][i] - existing_record.predict)
                        updated_forecasts += 1
                        logger.info(f"🔄 Updated forecast for {date} with actual data")
                    else:
                        new_observations.append({
                            "date": date, 
                            "endog": parsed_data["endog"][i],
                            "predict": None,
                            "ci_low": None,
                            "ci_up": None,
                            "conf_level": None, 
                            "absolute_error": None,  
                            "last_summary": None,
                        })  
            if updated_forecasts > 0:
                db_session.commit()
                logger.info(f"📊 Updated {updated_forecasts} existing forecasts with actual data")
            if new_observations:
                crud.bulk_create(db_session, new_observations)
                logger.info(f"💾 Saved {len(new_observations)} new observations")
            else:
                logger.info("\n🆗 No new observations to save")
            if not updated_forecasts and not new_observations:
                return True

            # Получаем данные для прогнозирования
            observation_window_size = task_config['model']['observation_window_size']
            logger.info(f"\n🔍 Loading last {observation_window_size} observations for forecasting...")
            observations_for_forecast = db_session.query(crud.model)\
                            .filter(crud.model.endog.isnot(None))\
                            .order_by(desc(crud.model.date))\
                            .limit(observation_window_size)\
                            .all()

            if not observations_for_forecast:
                raise ValueError("No training data available")
            
            logger.info(f"📊 Observations loaded: {len(observations_for_forecast)} points")
            logger.info(f"📆 From {observations_for_forecast[-1].date} to {observations_for_forecast[0].date}")  

            # Подготовка данных для прогноза
            forecast_input = {
                'endog': [obs.endog for obs in reversed(observations_for_forecast)],
                'dates': [obs.date for obs in reversed(observations_for_forecast)]
            }

            # Строим прогноз
            logger.info('forecast_input: ', forecast_input)
            logger.info("\n🔮 Running forecast...")
            forecast_result = forecast(
                data=forecast_input,
                model_type=task_config['model']['type'],
                settings=task_config['model']['params']
            )
            logger.info(f"✅ Forecast completed for {len(forecast_result['prediction'])} future points")

            # Добавление прогнозов в БД
            historical_len = len(forecast_input['endog'])
            forecast_dates = forecast_result['full_dates'][historical_len:]
            logger.info(f"\n📝 Updating {len(forecast_dates)} forecast points in DB...")
            
            updated = 0
            created = 0
            for pred_idx, date in enumerate(forecast_dates):
                existing = db_session.query(crud.model)\
                            .filter(crud.model.date == date)\
                            .first()
                
                update_data = {
                    'predict': forecast_result['prediction'][pred_idx],
                    'ci_low': forecast_result['confidence_intervals']['intervals'][pred_idx][0],
                    'ci_up': forecast_result['confidence_intervals']['intervals'][pred_idx][1],
                    'conf_level': forecast_result['confidence_intervals']['confidence_level'],
                    'last_summary': forecast_result['summary'] if pred_idx == len(forecast_dates)-1 else None
                }
                
                if existing:
                    updated += 1
                    for key, value in update_data.items():
                        setattr(existing, key, value)
                else:
                    created += 1
                    new_forecast = crud.model(
                        date=date,
                        endog=None,
                        **update_data
                    )
                    db_session.add(new_forecast)

            db_session.commit()
            logger.info(f"📊 Forecast points updated: {updated}")
            logger.info(f"📊 Forecast points created: {created}")
            logger.info(f"\n🎉 Task completed successfully!")
            return True

        except Exception as e:
            db_session.rollback()
            logger.error(f"\n❌ {'!'*50}")
            logger.error(f"❌ Task FAILED: {str(e)}")
            logger.error(f"❌ {'!'*50}")
            traceback.print_exc()
            raise
        finally:
            db_session.close()
    
    async def stop(self):
        """
        Корректная остановка всех задач планировщика.

        Останавливает все активные корутины и завершает выполнение задач.
        """
        logger.info("🛑 Stopping scheduler...")
        self._shutdown_event.set()

        for task in self._running_tasks:
            task.cancel()

        await asyncio.gather(*self._running_tasks, return_exceptions=True)
        self._running_tasks = []
        logger.info("✅ Scheduler stopped")