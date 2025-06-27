import httpx
from datetime import datetime, timedelta
from typing import Dict, Any
import asyncio
from abc import ABC, abstractmethod
import json
import requests

from .utils import convert_to_datetime


class BaseParser(ABC):
    """Базовый класс для всех парсеров"""
    URL = None

    async def fetch(self, params: Dict) -> Dict:
        """Асинхронный метод получения данных"""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                self.URL,
                params=params
            )
            response.raise_for_status()
            return self.parse(response.json())
    
    def fetch_sync(self, params: Dict) -> Dict:
        """Синхронная версия для вызова в ProcessPoolExecutor"""
        response = requests.get(
            self.URL,
            params=params,
            timeout=30
        )
        response.raise_for_status()
        return self.parse(response.json())
    
    @abstractmethod
    def parse(self, raw_data: Dict) -> Dict:
        """Преобразование сырых данных в единый формат"""
        raise NotImplementedError


class OpenMeteoParser(BaseParser):
    """Парсер погодных данных с Open-Meteo"""
    # SOURCE_NAME = "openmeteo"
    URL = "https://archive-api.open-meteo.com/v1/archive"

    def parse(self, raw_data: Dict) -> Dict:
        freq = next((f for f in ['hourly', 'daily', 'current'] if f in raw_data), None) 
        if not freq: 
            raise ValueError("Response doesn't contain any known time frequency (hourly/daily/current) or your request is in incorrect format.")
        param_name = next((p for p in raw_data[freq] if p != "time"), None)
        if not param_name: 
            raise ValueError(f"No weather parameters found in {freq} data or your request is in incorrect format.")
        
        return {
            "endog": raw_data[freq][param_name],
            "dates": convert_to_datetime(raw_data[freq]["time"]),
        }


# Тестирование
if __name__ == "__main__":
    end_date = datetime.now().date() - timedelta(days=2)
    start_date = end_date - timedelta(days=3)
    myd = {
        "latitude": 55.77159, 
        "longitude": 37.692222,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "daily": "temperature_2m_min",
    }
    parser = OpenMeteoParser()
    res = parser.fetch_sync(myd)
    print('Results:', res)
