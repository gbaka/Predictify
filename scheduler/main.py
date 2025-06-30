"""
Точка входа для запуска планировщика задач парсинга и прогнозирования.

Основные действия:
- Инициализирует базу данных
- Загружает конфигурацию задач из YAML-файла
- Запускает планировщик задач с использованием пула процессов
"""

import asyncio
import signal
from concurrent.futures import ProcessPoolExecutor

from database import init_db
from logger import Logger
from scheduler import Scheduler
from config_loader import ConfigLoader


logger = Logger(name="scheduler", log_dir="logs", log_file="scheduler.log").get_logger()


async def main():
    """
    Асинхронная функция запуска планировщика.

    - Инициализирует БД
    - Загружает конфиг задач
    - Создаёт экземпляр планировщика
    - Запускает планировщик в фоне
    """
    init_db()

    config_loader = ConfigLoader("scheduler/scheduler_config.yml")
    tasks_config = config_loader.tasks

    pool = ProcessPoolExecutor()
    scheduler = Scheduler(tasks_config, pool)

    stop_event = asyncio.Event()
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, stop_event.set)

    try:
        await scheduler.start()
        logger.info("Планировщик запущен. Ожидание сигнала завершения...")
        await stop_event.wait()
    except Exception as e:
        logger.exception(f"Ошибка при работе планировщика: {e}")
    finally:
        logger.info("Завершение работы. Остановка планировщика...")
        await scheduler.stop()
        pool.shutdown(wait=True)
        logger.info("Планировщик остановлен. Выход.")


if __name__ == "__main__":
    asyncio.run(main())
