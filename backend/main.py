from fastapi import FastAPI
from api.routes import router as api_router
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from concurrent.futures import ProcessPoolExecutor
import asyncio
import os

from services.scheduler import Scheduler
from services.config_loader import ConfigLoader
from database import init_db
from utils import SimpleFileLock

from logger import Logger

logger = Logger().get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.forecasting_process_pool = ProcessPoolExecutor(os.cpu_count() * 2)

    # Запуск планировщика только в одном из воркеров
    lock = SimpleFileLock("/tmp/scheduler.lock")
    if lock.acquire():
        logger.info("[Scheduler] Initializing scheduler")
        init_db()

        # Пул процесса планировщика
        app.state.scheduler_proccess_pool = ProcessPoolExecutor(os.cpu_count())
        config_loader = ConfigLoader("./services/scheduler_config.yml")
        tasks_config = config_loader.tasks
        app.state.scheduler = Scheduler(tasks_config, app.state.scheduler_proccess_pool)

        logger.info("[Scheduler] Starting a scheduler")
        asyncio.create_task(app.state.scheduler.start())
        logger.info("[Scheduler] Scheduler started")
    else:
        logger.info("🔄 Scheduler running in another worker")

    yield

    if hasattr(app.state, "scheduler"):
        logger.info("[Scheduler] Stopping scheduler")
        await app.state.scheduler.stop()
        app.state.scheduler_proccess_pool.shutdown(wait=True)
        lock.release()

    app.state.forecasting_process_pool.shutdown(wait=True)


app = FastAPI(title="Forecasting API", lifespan=lifespan)

app.include_router(api_router, prefix="/api")

# Настройка CORS: разрешаем доступ с нужных источников
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3030"],  # frontend-dev
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы, например, GET, POST
    allow_headers=["*"],  # Разрешаем все заголовки
)
