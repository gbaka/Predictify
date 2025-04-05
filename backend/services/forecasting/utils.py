from datetime import timedelta
from typing import List, Dict
import re


def extend_dates(data: Dict, steps: int) -> List:
    """
    Расширяет список дат на заданное количество шагов вперёд.

    Если `dates` равен None, возвращает список индексов.

    Параметры:
        data (dict): Данные временного ряда с ключами:
            - "dates" (Optional[List[datetime]]): Список дат или None.
            - "endog" (List[float]): Значения временного ряда.
        steps (int): Количество шагов для расширения.

    Возвращает:
        List: Расширенный список дат или индексов.
    """
    dates = data["dates"]
    if dates:
        last_date = dates[-1]
        new_dates = [last_date + timedelta(days=i) for i in range(1, steps + 1)]
        return dates + new_dates
    else:
        return list(range(len(data["endog"]) + steps))
    

def is_camel_case(s: str) -> bool:
    """
    Проверяет, является ли строка написанной в стиле camelCase.

    Строка считается camelCase, если:
    - Первый символ в нижнем регистре
    - Нет подчёркиваний
    - Содержит хотя бы одну заглавную букву внутри слова

    Параметры:
        s (str): Строка для проверки.

    Возвращает:
        bool: True если строка в camelCase, иначе False.
    """
    if not s or '_' in s or s[0].isupper():
        return False
    return any(c.isupper() for c in s[1:])


def camel_to_snake(s: str) -> str:
    """
    Транслирует строку из camelCase в snake_case.

    Преобразует заглавные буквы в нижний регистр и добавляет перед ними подчёркивание.
    Первая буква всегда остаётся в нижнем регистре.

    Параметры:
        s (str): Строка в camelCase для преобразования.

    Возвращает:
        str: Строка в snake_case.
    """
    if not is_camel_case(s):
        return s

    snake_str = re.sub('([A-Z])', r'_\1', s).lower()
    
    return snake_str.lstrip('_')
