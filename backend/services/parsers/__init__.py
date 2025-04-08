"""
Парсинг данных из внешних источников.

Модуль содержит функции для получения данных из различных API (например, Open-Meteo) 
и их преобразования в единый формат для дальнейшего прогнозирования.

- parse: Основная функция для выбора парсера и получения данных.
"""

from typing import Dict
from .parsers import OpenMeteoParser


def parse(parser_type: str, params: Dict) -> Dict:
    """
    Получение данных из указанного источника.

    Параметры:
        parser_type (str): Тип парсера (например, "openmeteo").
        params (Dict): Параметры запроса к API (координаты, даты и т.д.).

    Возвращаемое значение:
        Dict: Словарь с данными в формате:
            {
                    "endog": List[float],  # Значения временного ряда
                    "dates": List[datetime] # Соответствующие даты
            },

    Исключения:
        ValueError: Если указан неизвестный тип парсера.
        HTTPError: При ошибках запроса к API.
    """
    if parser_type == "OpenMeteo":
        parser = OpenMeteoParser()
        data = parser.fetch_sync(params)
        return data
    else:
        raise ValueError("Неизвестный парсер")