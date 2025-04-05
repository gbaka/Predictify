# services/parsers.py
import httpx
from datetime import datetime, timedelta
from typing import Dict, Any
import asyncio


class BaseParser:
    """Базовый класс для всех парсеров"""
    SOURCE_NAME = "base"
    UPDATE_INTERVAL = 60 * 30  # 30 минут по умолчанию

    async def fetch(self) -> Dict[str, Any]:
        """Основной метод для получения данных"""
        raise NotImplementedError

    def parse(self, raw_data: Dict) -> Dict:
        """Преобразование сырых данных в единый формат"""
        return raw_data


class OpenMeteoParser(BaseParser):
    """Парсер погодных данных с Open-Meteo"""
    SOURCE_NAME = "openmeteo"
    UPDATE_INTERVAL = 60 * 10  # 10 минут

    async def fetch(self) -> Dict:
        end_date = datetime.now().date() - timedelta(days=2)
        start_date = end_date - timedelta(days=3) 
        async with httpx.AsyncClient() as client:
            
            response = await client.get(
                "https://archive-api.open-meteo.com/v1/archive",
                params={
                    "latitude": 55.77159,  # Москва  55.771596, 37.692222
                    "longitude": 37.692222,
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat(),
                    "hourly": "temperature_2m"
                }
            )
            return self.parse(response.json())

    def parse(self, raw_data: Dict) -> Dict:
        return {
            "source": self.SOURCE_NAME,
            "timestamp": datetime.now().isoformat(),
            "data": {
                "temperatures": raw_data["hourly"]["temperature_2m"],
                "timestamps": raw_data["hourly"]["time"]
            }
        }

# class AlphaVantageParser(BaseParser):
#     """Парсер акций с Alpha Vantage"""
#     SOURCE_NAME = "alphavantage"
#     API_KEY = "YOUR_KEY"  # вынести в конфиг

#     async def fetch(self) -> Dict:
#         async with httpx.AsyncClient() as client:
#             response = await client.get(
#                 "https://www.alphavantage.co/query",
#                 params={
#                     "function": "TIME_SERIES_DAILY",
#                     "symbol": "IBM",
#                     "apikey": self.API_KEY
#                 }
#             )
#             return self.parse(response.json())

#     def parse(self, raw_data: Dict) -> Dict:
#         return {
#             "source": self.SOURCE_NAME,
#             "timestamp": datetime.now().isoformat(),
#             "data": {
#                 "prices": raw_data["Time Series (Daily)"],
#                 "metadata": raw_data["Meta Data"]
#             }
#         }

# # Готовые экземпляры парсеров для удобства
# PARSERS = {
#     "weather": OpenMeteoParser(),
#     "stocks": AlphaVantageParser()
# }


if __name__ == "__main__":
    parser = OpenMeteoParser()
    res = asyncio.run(parser.fetch())
    print(res)