# services/scheduler.py
import asyncio
import logging
from concurrent.futures import ProcessPoolExecutor
from typing import Dict, List
from datetime import datetime
import traceback

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
        print(f"🔧 Processing task '{task_config['name']}' at {datetime.now().isoformat()}")
        
        try:
            print(task_config)
            parsed_data = parse(
                parser_type=task_config['parser']['type'],
                params=task_config['parser']['params']
            )
            forecast_result = forecast(
                data=parsed_data,
                model_type=task_config['model']['type'],
                settings=task_config['model']['params']
            ) 
            # print(f"📊 Task '{task_config['name']}' completed successfully", forecast_result)
            # Добавить тут логику добавления результатов в базу данных

        except Exception as e:
            print(f"❌ Task '{task_config['name']}' failed during execution")
            raise 
        
    async def stop(self):
        """Корректная остановка всех задач"""
        print("🛑 Stopping scheduler...")
        self._shutdown_event.set()
        
        for task in self._running_tasks:
            task.cancel()
        
        await asyncio.gather(*self._running_tasks, return_exceptions=True)
        self._running_tasks = []
        print("✅ Scheduler stopped")