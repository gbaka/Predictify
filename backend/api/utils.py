from typing import Dict, Any
from datetime import datetime

def format_db_forecast_data(instances: list) -> Dict[str, Any]:
    """Преобразует список объектов прогноза из БД в структурированный словарь для API.

    Параметры
    ----------
    instances : list
        Список объектов моделей прогноза (наследников ForecastBase).
        Должен содержать поля: date, endog, predict, ci_low, ci_up,
        conf_level, absolute_error, last_summary, created_at.

    Возвращает
    -------
    Dict[str, Any]
        Словарь с ключами:
        - summary : str
            Текстовое описание прогноза из последней записи
        - full_dates : List[datetime]
            Отсортированный по возрастанию список временных меток
        - endog : List[float]
            Фактические значения временного ряда
        - confidence_intervals : List[List[float, float]]
            Границы доверительных интервалов [нижняя, верхняя]
        - confidence_level : float
            Уровень доверия для интервалов (0-1)
        - prediction : List[float]
            Предсказанные значения
        - absolute_error : List[float]
            Абсолютные ошибки прогноза
        - last_update : datetime
            Время последнего обновления данных

    Примеры
    --------
    >>> from datetime import datetime
    >>> test_data = [
    ...     type('TestModel', (), {
    ...         'date': datetime(2023, 1, 1),
    ...         'endog': 10.5,
    ...         'predict': 11.2,
    ...         'ci_low': 9.8,
    ...         'ci_up': 12.5,
    ...         'conf_level': 0.95,
    ...         'absolute_error': 0.7,
    ...         'last_summary': "Sunny weather expected",
    ...         'created_at': datetime(2023, 1, 1, 12, 0)
    ...     })
    ... ]
    >>> format_db_forecast_data(test_data)
    {
        'summary': 'Sunny weather expected',
        'full_dates': [datetime(2023, 1, 1, 0, 0)],
        ...
    }

    Примечания
    -----
    - Если передан пустой список, возвращает словарь с пустыми значениями
    - Данные автоматически сортируются по полю date
    - Для summary, confidence_level и last_update берутся значения
      из последней записи (по дате)
    """
    if not instances:
        return {
            "summary": "",
            "full_dates": [],
            "endog": [],
            "confidence_intervals": [],
            "confidence_level": 0.0,
            "prediction": [],
            "absolute_error": [],
            "last_update": None
        }
    
    sorted_instances = sorted(instances, key=lambda x: x.date)
    last_instance = sorted_instances[-1]
    
    return {
        "summary": last_instance.last_summary or "",
        "full_dates": [instance.date for instance in sorted_instances],
        "endog": [instance.endog for instance in sorted_instances],
        "confidence_intervals": [
            [instance.ci_low, instance.ci_up] 
            for instance in sorted_instances
        ],
        "confidence_level": last_instance.conf_level,
        "prediction": [instance.predict for instance in sorted_instances],
        "absolute_error": [instance.absolute_error for instance in sorted_instances],
        "last_update": last_instance.created_at
    }