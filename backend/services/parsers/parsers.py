# services/parsers.py
import httpx
from datetime import datetime, timedelta
from typing import Dict, Any
import asyncio
from abc import ABC, abstractmethod
import json


class BaseParser(ABC):
    """Базовый класс для всех парсеров"""
    URL = None

    async def fetch(self, params: Dict) -> Dict:
        async with httpx.AsyncClient() as client:     
            response = await client.get(
                self.URL,
                params=params
            )
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
        
        print(freq, param_name)
        return {
            "endog": raw_data[freq][param_name],
            "dates": raw_data[freq]["time"],
        }
    
        # return {
        #     # "source": self.SOURCE_NAME,
        #     "timestamp": datetime.now().isoformat(),
        #     "data": {
        #         "endog": raw_data["hourly"]["temperature_2m"],
        #         "dates": raw_data["hourly"]["time"]
        #     }
        # }


if __name__ == "__main__":

    end_date = datetime.now().date() - timedelta(days=2)
    start_date = end_date - timedelta(days=3)
    myd = {
        "latitude": 55.77159,  # Москва  55.771596, 37.692222
        "longitude": 37.692222,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "daily": "temperature_2m_min",
    }
    parser = OpenMeteoParser()
    res = asyncio.run(parser.fetch(myd))
    print(parser.fetch(myd))
    print(res)
