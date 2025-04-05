from fastapi import FastAPI
from api.routes import router as api_router
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from concurrent.futures import ProcessPoolExecutor


# Создание пула процессов для построения прогнозов на основе пользовательских данных
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.forecasting_process_pool = ProcessPoolExecutor()
    yield
    app.state.forecasting_process_pool.shutdown(wait=True)


app = FastAPI(title="Forecasting API", lifespan=lifespan)

# Подключаем маршруты
app.include_router(api_router, prefix="/api")

# Настройка CORS: разрешаем доступ с нужных источников (например, с фронтенда)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3030"],  # Разрешаем доступ с фронтенда
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы, например, GET, POST
    allow_headers=["*"],  # Разрешаем все заголовки
)