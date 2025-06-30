"""
Основной модуль запуска FastAPI приложения.

- Инициализирует базу данных.
- Настраивает пул процессов для прогнозирования.
- Подключает маршруты API.
- Добавляет CORS middleware для frontend.
"""

import os
from contextlib import asynccontextmanager
from concurrent.futures import ProcessPoolExecutor

from fastapi import FastAPI
from api.routes import router as api_router
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from logger import Logger


logger = Logger(name="backend", log_dir="logs", log_file="backend.log").get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Запуск FastAPI приложения.")
    init_db()
    app.state.forecasting_process_pool = ProcessPoolExecutor(os.cpu_count())

    yield

    app.state.forecasting_process_pool.shutdown(wait=True)
    logger.info("FastAPI приложение успешно завершило работу.")


app = FastAPI(title="Forecasting API", lifespan=lifespan)
app.include_router(api_router, prefix="/api")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3030"],  # frontend-dev
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы, например, GET, POST
    allow_headers=["*"],  # Разрешаем все заголовки
)
