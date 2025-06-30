"""
Утилиты для преобразования данных с парсеров.

Включает функции для конвертации строковых дат в datetime объекты.
"""

from datetime import datetime
from typing import List


def convert_to_datetime(date_strings: List[str]) -> List[datetime]:
    """
    Конвертирует список строк в datetime объекты.

    Parameters
    ----------
    date_strings : List[str]
        Список строк в формате 'YYYY-MM-DDTHH:MM'.

    Returns
    -------
    List[datetime]
        Список datetime объектов.
    """
    return [datetime.strptime(d, "%Y-%m-%dT%H:%M") for d in date_strings]
