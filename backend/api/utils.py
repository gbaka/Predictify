from typing import Dict, Any
from datetime import datetime
from fastapi import UploadFile


def format_db_forecast_data(instances: list) -> Dict[str, Any]:
    """
    Преобразует список прогнозных объектов из БД в словарь для API-ответа.

    Параметры
    ----------
    instances : list
        Список экземпляров модели прогноза с атрибутами (date, endog, predict, ci_low, ci_up и др.).

    Возвращает
    -------
    Dict[str, Any]
        Структурированный словарь с временными метками, значениями прогноза, интервалами, ошибками и метаданными.
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
            "last_update": None,
        }

    sorted_instances = sorted(instances, key=lambda x: x.date)
    last_instance = sorted_instances[-1]

    return {
        "summary": last_instance.last_summary or "",
        "full_dates": [instance.date for instance in sorted_instances],
        "endog": [instance.endog for instance in sorted_instances],
        "confidence_intervals": [
            [instance.ci_low, instance.ci_up] for instance in sorted_instances
        ],
        "confidence_level": last_instance.conf_level,
        "prediction": [instance.predict for instance in sorted_instances],
        "absolute_error": [instance.absolute_error for instance in sorted_instances],
        "last_update": last_instance.created_at,
    }


def validate_file_size(uploaded_file: UploadFile, max_size):
    """Проверяет, не превышает ли размер загруженного файла заданный лимит.

    Параметры
    ----------
    uploaded_file : UploadFile
        Загруженный файл для проверки.
    max_size : int
        Максимально допустимый размер файла в байтах.

    Исключения
    ----------
    ValueError
        Если размер файла превышает допустимое значение.
    """

    if uploaded_file.size is not None and uploaded_file.size > max_size:
        raise ValueError(
            f"File '{uploaded_file.filename}' is too large: {uploaded_file.size / 1024:.2f} KB. "
            f"Maximum allowed size is {max_size / 1024:.2f} KB.",
        )
