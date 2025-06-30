"""
Преобразование Excel-файлов во внутреннее словарное представление.

Модуль содержит функцию, конвертирующую содержимое Excel-файла в структуру,
пригодную для дальнейшего анализа и построения прогнозов.
"""

import pandas as pd
from datetime import datetime
from starlette.datastructures import UploadFile
from .utils import detect_date_format


def excel_to_dict(file: UploadFile) -> dict:
    """
    Конвертирует загруженный Excel-файл в словарь с данными и, при наличии, датами.

    Parameters
    ----------
    file : UploadFile
        Загруженный Excel-файл.

    Returns
    -------
    dict
        Словарь с ключами:
        - "dates": список объектов datetime (если столбец дат присутствует) или None,
        - "endog": список числовых значений временного ряда.
    """
    
    df = pd.read_excel(file.file)  # Загружаем Excel-файл в DataFrame

    if "dates" not in df.columns:
        # Если столбца "dates" нет, устанавливаем dates в None
        data = {
            "dates": None,
            "endog": df.iloc[:, 0].astype(float).tolist()  # Конвертируем первый столбец в значения
        }
    else:
        # Если столбец "dates" есть, определяем формат даты и преобразуем их
        date_format = None
        try:
            # Пробуем определить формат даты на основе первой строки
            sample_date = df["dates"].iloc[0]
            if isinstance(sample_date, str):  # Если дата представлена как строка
                date_format = detect_date_format(sample_date)
        except Exception as e:
            raise ValueError(f"Ошибка при определении формата даты: {e}")

        # Преобразуем даты в datetime объекты
        if date_format:
            # Если формат даты определен, используем его для парсинга
            df["dates"] = df["dates"].apply(
                lambda x: datetime.strptime(x, {
                    "YYYY-MM-DD": "%Y-%m-%d",
                    "DD.MM.YYYY": "%d.%m.%Y",
                    "MM/DD/YYYY": "%m/%d/%Y",
                    "DD/MM/YYYY": "%d/%m/%Y",
                }[date_format])
            )
        else:
            # Если формат не определен, пытаемся автоматически преобразовать
            df["dates"] = pd.to_datetime(df["dates"])

        data = {
            "dates": df["dates"].tolist(),  # Преобразуем даты в список
            "endog": df.drop(columns=["dates"]).iloc[:, 0].astype(float).tolist()  # Конвертируем значения
        }
    return data