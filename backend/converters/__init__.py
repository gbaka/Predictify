from starlette.datastructures import UploadFile
from .excel_to_dict import excel_to_dict
from .csv_to_dict import csv_to_dict

def convert_to_dict(file: UploadFile):
    """Определяет тип файла и вызывает нужный конвертер."""
    if file.filename.endswith('.csv'):
        return csv_to_dict(file)
    elif file.filename.endswith('.xlsx'):
        return excel_to_dict(file)
    else:
        raise ValueError("Файл должен быть в формате CSV или Excel (.xlsx)")
