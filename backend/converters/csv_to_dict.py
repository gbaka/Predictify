import csv
from io import StringIO
from starlette.datastructures import UploadFile
from datetime import datetime

def csv_to_dict(file: UploadFile) -> dict:
    """
    Конвертирует загруженный CSV-файл в словарь со столбцами "dates" (если есть) или "index".
    
    `param file`: Загруженный CSV-файл (UploadFile)\n
    `return`: Словарь с разделением по датам (если есть) или индексам
    """
    content = file.file.read().decode('utf-8')  # Читаем и декодируем файл в строку
    file.file.seek(0)  # Возвращаем указатель в начало файла

    reader = csv.DictReader(StringIO(content))  # Создаем объект DictReader
    

    use_index = "dates" not in reader.fieldnames  # Проверяем наличие столбца "date"
    if use_index: 
        data = {"dates": None, "endog": []}  # Инициализируем структуру словаря
    else:
        data = {"dates": [], "endog": []}  # Инициализируем структуру словаря
    
    for i, row in enumerate(reader):
        if use_index:
            data["endog"].append(float(list(row.values())[0]))
        else:
            data["dates"].append(datetime.fromisoformat(row["dates"]))  # Используем "date" из файла
            data["endog"].append([float(val) for key, val in row.items() if key != "dates"][0])
    return data  # Возвращаем словарь
