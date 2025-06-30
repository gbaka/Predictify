"""
Преобразование CSV-файлов во внутреннее словарное представление.

Модуль содержит функцию, конвертирующую содержимое CSV-файла в структуру, 
пригодную для дальнейшего анализа и построения прогнозов.
"""

import csv
from io import StringIO
from starlette.datastructures import UploadFile
from datetime import datetime
from .utils import detect_date_format, detect_delimiter, validate_csv_size
from .config import ConvertersConfig


def csv_to_dict(file: UploadFile, delimiter: str = "auto", date_format: str = "auto") -> dict:
    """
    Конвертирует загруженный CSV-файл в словарь с данными и, при наличии, датами.

    Parameters
    ----------
    file : UploadFile
        Загруженный CSV-файл.

    delimiter : str, optional
        Разделитель значений в CSV. Может быть ',', ';', ' ', '\\t' или 'auto' (по умолчанию).

    date_format : str, optional
        Формат даты в столбце "dates". Допустимые значения: "YYYY-MM-DD", "DD.MM.YYYY",
        "MM/DD/YYYY", "DD/MM/YYYY" или "auto" (по умолчанию).

    Returns
    -------
    dict
        Словарь с ключами:
        - "dates": список объектов datetime (если столбец дат присутствует),
        - "endog": список числовых значений временного ряда.
    """  

    content = file.file.read().decode('utf-8')  
    validate_csv_size(content, ConvertersConfig.MAX_FILE_ROWS)

    file.file.seek(0)  

    if delimiter == "auto":
        first_line = content.split('\n')[0]
        delimiter = detect_delimiter(first_line, ConvertersConfig.CSV_DELIMITERS, ConvertersConfig.CSV_DEFAULT_DELIMETER)

    reader = csv.DictReader(StringIO(content), delimiter=delimiter)  
    use_index = "dates" not in reader.fieldnames  
    if use_index: 
        data = {"dates": None, "endog": []} 
    else:
        data = {"dates": [], "endog": []} 

    if date_format == "auto" and not use_index:
        sample_date = next(reader)["dates"]
        date_format = detect_date_format(sample_date)

    file.file.seek(0)
    reader = csv.DictReader(StringIO(content), delimiter=delimiter)

    for i, row in enumerate(reader):
        if use_index:
            data["endog"].append(float(list(row.values())[0]))
        else:
            date_str = row["dates"]
            if date_format == "YYYY-MM-DD":
                date = datetime.strptime(date_str, "%Y-%m-%d")
            elif date_format == "DD.MM.YYYY":
                date = datetime.strptime(date_str, "%d.%m.%Y")
            elif date_format == "MM/DD/YYYY":
                date = datetime.strptime(date_str, "%m/%d/%Y")
            elif date_format == "DD/MM/YYYY":
                date = datetime.strptime(date_str, "%d/%m/%Y")
            else:
                date = datetime.fromisoformat(date_str)  # По умолчанию используем ISO формат

            data["dates"].append(date)
            data["endog"].append([float(val) for key, val in row.items() if key != "dates"][0])
    return data  