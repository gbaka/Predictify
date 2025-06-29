import asyncio
from concurrent.futures import ProcessPoolExecutor

from database import init_db
from logger import Logger
from scheduler import Scheduler
from config_loader import ConfigLoader

logger = Logger(name='scheduler', log_dir='logs', log_file='scheduler.log').get_logger()

async def main():
    init_db()

    config_loader = ConfigLoader("scheduler/scheduler_config.yml")
    tasks_config = config_loader.tasks

    pool = ProcessPoolExecutor()
    scheduler = Scheduler(tasks_config, pool)

    try:
        await scheduler.start()
        while True:
            await asyncio.sleep(3600) 
    except KeyboardInterrupt:
        await scheduler.stop()

if __name__ == "__main__":
    asyncio.run(main())
