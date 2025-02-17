from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# Разрешаем CORS для всех доменов
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Можно указать конкретные домены вместо "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Пример данных для фронтенда
class Forecast(BaseModel):
    date: str
    value: float

@app.get("/api/forecast", response_model=list[Forecast])
async def get_forecast():
    # Пример данных, которые можно получить из базы или другого источника
    forecast_data = [
        {"date": "2026-02-18", "value": 1.235},
        {"date": "2025-02-19", "value": 1.25},
        {"date": "2025-12-20", "value": 1.27},
    ]
    return forecast_data
