"""
Утилиты для обработки данных и валидации в API.

Содержит функции для форматирования результатов из базы данных и проверки размера загружаемых файлов.
"""

from typing import Dict, Any
from datetime import datetime
from fastapi import UploadFile


def format_db_forecast_data(instances: list) -> Dict[str, Any]:
    """
    Преобразует список объектов прогноза из БД в формат API-ответа.

    Сортирует данные по дате и извлекает основные поля: прогноз, интервалы,
    ошибки, уровень доверия и дату обновления.

    Parameters
    ----------
    instances : list
        Список ORM-объектов с полями date, endog, predict, ci_low, ci_up,
        conf_level, absolute_error и last_summary.

    Returns
    -------
    dict
        Словарь с информацией о прогонзе, пригодный для обработки на фронтенде.
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
    """
    Проверяет, не превышает ли размер загруженного файла допустимый предел.

    Parameters
    ----------
    uploaded_file : UploadFile
        Загруженный пользователем файл.
    max_size : int
        Максимально разрешённый размер файла (в байтах).

    Raises
    ------
    ValueError
        Если файл превышает установленный лимит.
    """

    if uploaded_file.size is not None and uploaded_file.size > max_size:
        raise ValueError(
            f"File '{uploaded_file.filename}' is too large: {uploaded_file.size / 1024:.2f} KB. "
            f"Maximum allowed size is {max_size / 1024:.2f} KB.",
        )
