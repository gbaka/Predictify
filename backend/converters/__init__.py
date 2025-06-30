"""
Инициализация модуля преобразования данных.

Определяет функцию-обёртку для выбора соответствующего конвертера (CSV или Excel)
в зависимости от формата загружаемого файла.
"""

from starlette.datastructures import UploadFile
from .excel_to_dict import excel_to_dict
from .csv_to_dict import csv_to_dict
from logger import Logger


logger = Logger(
    name="converters", log_dir="logs", log_file="converters.log"
).get_logger()


def convert_to_dict(file: UploadFile, settings: dict):
    """
    Преобразует загружаемый файл в словарь на основе его формата.

    Вызывает соответствующую функцию преобразования для файлов CSV или Excel,
    в зависимости от расширения файла. Также преобразует параметры в нужный формат.

    Parameters
    ----------
    file : UploadFile
        Загруженный пользователем файл данных.
    settings : dict
        Параметры преобразования, включая формат даты и разделитель (для CSV).

    Returns
    -------
    dict
        Словарь, содержащий данные из файла.

    Raises
    ------
    ValueError
        Если формат файла не поддерживается.
    """

    if file.filename.endswith(".csv"):
        settings["delimiter"] = settings.pop("csvDelimiter")
        settings["date_format"] = settings.pop("dateFormat")
        result = csv_to_dict(file, **settings)
        logger.info("CSV-файл успешно преобразован в словарь.")
        return result
    elif file.filename.endswith(".xlsx"):
        result = excel_to_dict(file)
        logger.info("Excel-файл успешно преобразован в словарь.")
        return result
    else:
        logger.error(f"Неподдерживаемый формат файла: {file.filename}")
        raise ValueError("Файл должен быть в формате CSV или Excel (.xlsx)")
