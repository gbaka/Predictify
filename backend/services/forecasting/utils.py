from datetime import timedelta
from typing import List, Optional

def extend_dates(data: dict, steps: int) -> List:
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
