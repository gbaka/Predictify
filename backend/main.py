from fastapi import FastAPI
from api.routes import router as api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Forecasting API")

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

@app.get("/")
async def root():
    return {"message": "Forecasting API is running!"}
