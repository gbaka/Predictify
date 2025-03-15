import csv
from io import StringIO
from starlette.datastructures import UploadFile

def csv_to_dict(file: UploadFile) -> dict:
    """
    Конвертирует загруженный CSV-файл в словарь со столбцами "date" (если есть) или "index".
    
    `param file`: Загруженный CSV-файл (UploadFile)\n
    `return`: Словарь с разделением по датам (если есть) или индексам
    """
    content = file.file.read().decode('utf-8')  # Читаем и декодируем файл в строку
    file.file.seek(0)  # Возвращаем указатель в начало файла

    reader = csv.DictReader(StringIO(content))  # Создаем объект DictReader
    data = {"date": [], "values": []}  # Инициализируем структуру словаря

    use_index = "date" not in reader.fieldnames  # Проверяем наличие столбца "date"

    for i, row in enumerate(reader):
        if use_index:
            data["date"].append(i)  # Если "date" нет, используем индекс строки
            data["values"].append(list(row.values())[0])
        else:
            data["date"].append(row["date"])  # Используем "date" из файла
            data["values"].append([val for key, val in row.items() if key != "date"][0])
    return data  # Возвращаем словарь
