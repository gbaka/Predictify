# services/scheduler.py
import asyncio
import logging
from concurrent.futures import ProcessPoolExecutor
from sqlalchemy import desc
from typing import Dict, List
from datetime import datetime
import traceback

from database.crud import weather_crud, test_crud
from database import get_db_session
from .parsers import parse
from .forecasting import forecast


class Scheduler:
    def __init__(self, tasks_config: List[Dict], process_pool: ProcessPoolExecutor):
        """
        Планировщик с запуском задач в процессах
        
        :param tasks_config: Конфигурация задач
        :param process_pool: Пул процессов для выполнения задач
        """
        self.tasks_config = tasks_config
        self.process_pool = process_pool
        self._running_tasks = []
        self._shutdown_event = asyncio.Event()

    async def start(self):
        """Асинхронный запуск всех задач"""
        print(f"🚀 Starting scheduler with {len(self.tasks_config)} tasks")

        for task_config in self.tasks_config:
            task = asyncio.create_task(
                self._process_task_wrapper(task_config)
            )
            self._running_tasks.append(task)

        print("✅ All tasks running in background")

    async def _process_task_wrapper(self, task_config: Dict):
        """Обертка для запуска задачи в процессе"""
        loop = asyncio.get_running_loop()
        print("Wrapper:", task_config['name'])

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
                print(f"⚠️ Task '{task_config['name']}' failed: {str(e)}")
                print(traceback.format_exc())
                print(f"🔄 Retrying in {task_config['schedule']['retry_cooldown']}s...")
                await asyncio.sleep(task_config['schedule']['retry_cooldown'])

    @staticmethod
    def _process_task(task_config: Dict) -> bool:
        """
        Основная логика выполнения задачи в процессе
        
        Параметры:
            task_config: Конфигурация задачи с параметрами парсера и модели
            
        Исключения:
            ValueError: При ошибках парсинга или прогнозирования
        """
        print(f"\n{'='*50}")
        print(f"🔧 Starting task: {task_config['name']} ({datetime.now().strftime('%Y-%m-%d %H:%M:%S')})")
        print(f"📌 Table: {task_config['database']['tablename']}")
        print(f"🔮 Model: {task_config['model']['type']}")
        print(f"{'='*50}")

        TABLE_CRUD = {
            'weather_forecast': weather_crud,
            'test': test_crud
        }

        try:
            # Открываем сессию БД
            db = next(get_db_session())

            # Получаем дату для последнего ненулевого endog из БД
            tablename = task_config['database']['tablename']
            crud = TABLE_CRUD[tablename]
            last_observation = (
                db.query(crud.model)
                .filter(crud.model.endog.isnot(None))
                .order_by(desc(crud.model.date))
                .first()
            )
            last_obs_date = last_observation.date if last_observation else None
            print(f"\n📅 Last observation date in DB: {last_obs_date or 'No data'}")

            # Парсим новые наблюдаемые данные
            print("\n🔄 Fetching new data from source...")
            parsed_data = parse(
                parser_type=task_config['parser']['type'],
                params=task_config['parser']['params']
            )
            print(f"✅ Received {len(parsed_data['dates'])} data points")
            print(f"📆 Date range: {parsed_data['dates'][0]} to {parsed_data['dates'][-1]}")

            # Фильтруем напарсенные данные и вычисляем ошибки для старых прогнозов
            updated_forecasts = 0
            new_observations = []
            for i, date in enumerate(parsed_data["dates"]):
                if not last_obs_date or date > last_obs_date:
                    existing_record = db.query(crud.model)\
                                    .filter(crud.model.date == date)\
                                    .first()       
                    if existing_record and existing_record.predict is not None:
                        existing_record.endog = parsed_data["endog"][i]
                        if parsed_data["endog"][i] is not None:
                            existing_record.absolute_error = abs(parsed_data["endog"][i] - existing_record.predict)
                        updated_forecasts += 1
                        print(f"🔄 Updated forecast for {date} with actual data")
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
                db.commit()
                print(f"📊 Updated {updated_forecasts} existing forecasts with actual data")
            if new_observations:
                crud.bulk_create(db, new_observations)
                print(f"💾 Saved {len(new_observations)} new observations")
            else:
                print("\n🆗 No new observations to save")
            if not updated_forecasts and not new_observations:
                return True

            # Получаем данные для прогнозирования
            observation_window_size = task_config['model']['observation_window_size']
            print(f"\n🔍 Loading last {observation_window_size} observations for forecasting...")
            observations_for_forecast = db.query(crud.model)\
                            .filter(crud.model.endog.isnot(None))\
                            .order_by(desc(crud.model.date))\
                            .limit(observation_window_size)\
                            .all()

            if not observations_for_forecast:
                raise ValueError("No training data available")
            
            print(f"📊 Observations loaded: {len(observations_for_forecast)} points")
            print(f"📆 From {observations_for_forecast[-1].date} to {observations_for_forecast[0].date}")  

            # Подготовка данных для прогноза
            forecast_input = {
                'endog': [obs.endog for obs in reversed(observations_for_forecast)],
                'dates': [obs.date for obs in reversed(observations_for_forecast)]
            }

            # Строим прогноз
            print('forecast_input: ', forecast_input)
            print("\n🔮 Running forecast...")
            forecast_result = forecast(
                data=forecast_input,
                model_type=task_config['model']['type'],
                settings=task_config['model']['params']
            )
            print(f"✅ Forecast completed for {len(forecast_result['prediction'])} future points")

            # Добавление прогнозов в БД
            historical_len = len(forecast_input['endog'])
            forecast_dates = forecast_result['full_dates'][historical_len:]
            print(f"\n📝 Updating {len(forecast_dates)} forecast points in DB...")
            
            updated = 0
            created = 0
            for pred_idx, date in enumerate(forecast_dates):
                existing = db.query(crud.model)\
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
                    db.add(new_forecast)

            db.commit()
            print(f"📊 Forecast points updated: {updated}")
            print(f"📊 Forecast points created: {created}")
            print(f"\n🎉 Task completed successfully!")
            return True

        except Exception as e:
            db.rollback()
            print(f"\n❌ {'!'*50}")
            print(f"❌ Task FAILED: {str(e)}")
            print(f"❌ {'!'*50}")
            traceback.print_exc()
            raise
        finally:
            db.close()
            print("\n" + "="*50)
    
    async def stop(self):
        """Корректная остановка всех задач"""
        print("🛑 Stopping scheduler...")
        self._shutdown_event.set()

        for task in self._running_tasks:
            task.cancel()

        await asyncio.gather(*self._running_tasks, return_exceptions=True)
        self._running_tasks = []
        print("✅ Scheduler stopped")