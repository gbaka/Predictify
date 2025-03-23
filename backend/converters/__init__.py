from starlette.datastructures import UploadFile
from .excel_to_dict import excel_to_dict
from .csv_to_dict import csv_to_dict

def convert_to_dict(file: UploadFile, settings: dict):
    """Определяет тип файла и вызывает нужный конвертер."""
    if file.filename.endswith('.csv'):
        settings["delimiter"] = settings.pop("csvDelimiter")
        settings["date_format"] = settings.pop("dateFormat")
        return csv_to_dict(file, **settings)
    elif file.filename.endswith('.xlsx'):
        return excel_to_dict(file)
    else:
        raise ValueError("Файл должен быть в формате CSV или Excel (.xlsx)")
