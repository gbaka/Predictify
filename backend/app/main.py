from fastapi import FastAPI, Query
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

@app.get("/test")
async def test_endpoint(query: str = Query(None, description="Тестовый параметр")):
    return {"message": "Полученные данные", "query": query}