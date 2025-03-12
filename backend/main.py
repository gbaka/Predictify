from fastapi import FastAPI
from api.routes import router as api_router

app = FastAPI(title="Forecasting API")

# Подключаем маршруты
app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Forecasting API is running!"}
