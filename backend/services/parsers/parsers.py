"""
Парсеры для получения и преобразования данных из внешних API.

Модуль содержит базовый абстрактный класс парсера и реализацию для Open-Meteo API.
"""

from datetime import datetime, timedelta
from typing import Dict, Any
from abc import ABC, abstractmethod
import requests

import httpx

from .utils import convert_to_datetime


class BaseParser(ABC):
    """
    Абстрактный базовый класс для всех парсеров.

    Attributes
    ----------
    URL : str
        Базовый URL API для запроса.

    Methods
    -------
    fetch(params: Dict) -> Dict
        Асинхронное получение и парсинг данных.
    fetch_sync(params: Dict) -> Dict
        Синхронное получение и парсинг данных.
    parse(raw_data: Dict) -> Dict
        Преобразование сырых данных в единый формат (абстрактный метод).
    """

    URL = None

    async def fetch(self, params: Dict) -> Dict:
        """
        Асинхронный метод запроса данных с API.

        Parameters
        ----------
        params : Dict
            Параметры запроса к API.

        Returns
        -------
        Dict
            Обработанные данные в формате словаря.

        Raises
        ------
        HTTPError
            При ошибках HTTP-запроса.
        """
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                self.URL,
                params=params
            )
            response.raise_for_status()
            return self.parse(response.json())
    
    def fetch_sync(self, params: Dict) -> Dict:
        """
        Синхронный метод запроса данных с API.

        Parameters
        ----------
        params : Dict
            Параметры запроса к API.

        Returns
        -------
        Dict
            Обработанные данные в формате словаря.

        Raises
        ------
        HTTPError
            При ошибках HTTP-запроса.
        """
        response = requests.get(
            self.URL,
            params=params,
            timeout=30
        )
        response.raise_for_status()
        return self.parse(response.json())
    
    @abstractmethod
    def parse(self, raw_data: Dict) -> Dict:
        """
        *Абстрактный* метод преобразования сырых данных в единый формат.

        Parameters
        ----------
        raw_data : Dict
            Сырые данные от API.

        Returns
        -------
        Dict
            Обработанные данные с ключами 'endog' и 'dates'.
        """
        raise NotImplementedError


class OpenMeteoParser(BaseParser):
    """
    Парсер погодных данных с Open-Meteo.

    Attributes
    ----------
    URL : str
        URL для запросов к Open-Meteo API.

    Methods
    -------
    parse(raw_data: Dict) -> Dict
        Преобразование ответа Open-Meteo в стандартный формат.
    """
    # SOURCE_NAME = "openmeteo"
    URL = "https://archive-api.open-meteo.com/v1/archive"

    def parse(self, raw_data: Dict) -> Dict:
        """
        Преобразование сырых данных Open-Meteo в формат с 'endog' и 'dates'.

        Parameters
        ----------
        raw_data : Dict
            Сырые данные ответа API Open-Meteo.

        Returns
        -------
        Dict
            Данные временного ряда с ключами:
            - 'endog': список значений
            - 'dates': список datetime объектов

        Raises
        ------
        ValueError
            Если данные не содержат известных временных интервалов или параметров.
        """
        
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
