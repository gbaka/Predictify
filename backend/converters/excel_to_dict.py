import pandas as pd
from starlette.datastructures import UploadFile

def excel_to_dict(file: UploadFile) -> dict:
    """
    Конвертирует загруженный Excel-файл в словарь со столбцами "date" (если есть) или "index".
    
    `param file`: Загруженный Excel-файл (UploadFile)\n
    `return`: Словарь с разделением по датам (если есть) или индексам
    """
    df = pd.read_excel(file.file)  # Загружаем Excel-файл в DataFrame
    
    use_index = "date" not in df.columns  # Проверяем, есть ли столбец "date"

    data = {
        "date": df.index.tolist() if use_index else df["date"].astype(str).tolist(),  # Индексы или даты
        "values": df.drop(columns=["date"], errors="ignore").astype(float).to_dict(orient="records")  # Остальные данные
    }

    return data  # Возвращаем словарь
