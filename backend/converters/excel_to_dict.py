import pandas as pd
from starlette.datastructures import UploadFile

def excel_to_dict(file: UploadFile) -> dict:
    """
    Конвертирует загруженный Excel-файл в словарь со столбцами "dates" (если есть) или None.

    `param file`: Загруженный Excel-файл (UploadFile)\n
    `return`: Словарь с "dates" (список дат или None) и "endog" (список значений)
    """
    df = pd.read_excel(file.file)  # Загружаем Excel-файл в DataFrame

    if "dates" not in df.columns:
        # Если столбца "dates" нет, устанавливаем dates в None
        data = {
            "dates": None,
            "endog": df.astype(float).to_dict(orient="records")  # Конвертируем значения
        }
    else:
        # Если столбец "dates" есть, преобразуем даты в строки и извлекаем значения
        data = {
            "dates": pd.to_datestime(df["dates"]).tolist(),  # Преобразуем даты в datetime объекты
            "endog": df.drop(columns=["dates"]).astype(float).to_dict(orient="records")
        }

    return data
