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
 

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()

    app.state.forecasting_process_pool = ProcessPoolExecutor(os.cpu_count() * 2)
    app.state.scheduler_proccess_pool = ProcessPoolExecutor(os.cpu_count())

    config_loader = ConfigLoader("./services/scheduler_config.yml")
    tasks_config = config_loader.tasks
    scheduler = Scheduler(tasks_config, app.state.scheduler_proccess_pool)
    print("Starting a scheduler")
    asyncio.create_task(scheduler.start())
    print("Scheduler started")

    yield

    await scheduler.stop()
    app.state.forecasting_process_pool.shutdown(wait=True)


app = FastAPI(title="Forecasting API", lifespan=lifespan)

# Подключаем маршруты
app.include_router(api_router, prefix="/api")

# Настройка CORS: разрешаем доступ с нужных источников (например, с фронтенда)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",  # frontend 
        "http://localhost:3030"   # frontend-dev
    ],  
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы, например, GET, POST
    allow_headers=["*"],  # Разрешаем все заголовки
)