"""
Утилиты для обработки параметров и временных рядов.

Содержит функции для расширения дат, проверки NaN, преобразования camelCase и валидации входных данных.
"""

import re
import numpy as np
from typing import List, Dict


def extend_dates(data: Dict, steps: int) -> List:
    """
    Расширяет список дат на заданное количество шагов вперёд.

    Если "dates" отсутствует или равен None, возвращается список числовых индексов.

    Parameters
    ----------
    data : dict
        Словарь с данными временного ряда. Ожидаемые ключи:
            - "dates" (Optional[List[datetime]]): Список дат или None.
            - "endog" (List[float]): Значения временного ряда.
    steps : int
        Количество шагов для расширения вперёд.

    Returns
    -------
    List
        Расширенный список дат или числовых индексов.
    """

    dates = data["dates"]
   
    if dates:
        if len(dates) < 2:
            raise ValueError("Список дат должен состоять хотя бы из 2ух элементов.")  
        delta = dates[-1] - dates[-2]
        last_date = dates[-1]
        new_dates = [last_date + i*delta for i in range(1, steps + 1)]
        return dates + new_dates
    else:
        return list(range(len(data["endog"]) + steps))
    

def is_camel_case(s: str) -> bool:
    """
    Проверяет, написана ли строка в стиле camelCase.

    Parameters
    ----------
    s : str
        Строка для проверки.

    Returns
    -------
    bool
        True, если строка в стиле camelCase, иначе False.
    """

    if not s or '_' in s or s[0].isupper():
        return False
    return any(c.isupper() for c in s[1:])


def camel_to_snake(s: str) -> str:
    """
    Преобразует строку из camelCase в snake_case.

    Заглавные буквы становятся строчными с добавлением подчёркивания перед ними.

    Parameters
    ----------
    s : str
        Строка в стиле camelCase.

    Returns
    -------
    str
        Строка, преобразованная в snake_case.
    """

    if not is_camel_case(s):
        return s

    snake_str = re.sub('([A-Z])', r'_\1', s).lower()
    
    return snake_str.lstrip('_')


def validate_no_nans(data: np.ndarray, message: str) -> None:
    """
    Проверяет массив на наличие NaN значений и выбрасывает исключение, если они найдены.

    Parameters
    ----------
    data : np.ndarray
        Массив значений для проверки.
    message : str
        Сообщение исключения при обнаружении NaN.

    Raises
    ------
    ValueError
        Если в массиве найдены NaN значения.
    """
  
    if np.isnan(data).any():
        raise ValueError(message)
    return
    