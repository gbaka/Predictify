"""
Парсинг и преобразование данных из внешних API.

Модуль выбирает нужный парсер и возвращает данные в формате, пригодном для прогнозирования.
"""

from typing import Dict
from .parsers import OpenMeteoParser


def parse(parser_type: str, params: Dict) -> Dict:
    """
    Унифицированный интерфейс для получения данных от внешних API.
    
    Выбирает нужный парсер и возвращает данные в стандартном формате.

    Parameters
    ----------
    parser_type : str
        Тип парсера, например "OpenMeteo".
    params : Dict
        Параметры запроса к API.

    Returns
    -------
    Dict
        Данные временного ряда с ключами "endog" и "dates".

    Raises
    ------
    ValueError
        Если указан неизвестный тип парсера.
    HTTPError
        При ошибках запроса к API.
    """
     
    if parser_type == "OpenMeteo":
        parser = OpenMeteoParser()
        data = parser.fetch_sync(params)
        return data
    else:
        raise ValueError("Неизвестный парсер")