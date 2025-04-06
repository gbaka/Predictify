from datetime import datetime
from typing import List


def convert_to_datetime(date_strings: List[str]) -> List[datetime]:
    """
    Конвертирует список строк в datetime объекты

    Параметры:
        date_strings: Список строк в формате 'YYYY-MM-DDTHH:MM'

    Возвращает:
        Список datetime объектов
    """
    return [datetime.strptime(d, "%Y-%m-%dT%H:%M") for d in date_strings]
