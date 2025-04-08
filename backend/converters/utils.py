from typing import List


def detect_date_format(date_str: str) -> str:
    """
    Определяет формат даты на основе переданной строки.

    `date_str`: Строка с датой.\n
    `return`: Строка с форматом даты ("YYYY-MM-DD", "DD.MM.YYYY", "MM/DD/YYYY", "DD/MM/YYYY").
    """
    if '-' in date_str:
        return "YYYY-MM-DD"  # ISO 8601
    elif '.' in date_str:
        return "DD.MM.YYYY"
    elif '/' in date_str:
        parts = date_str.split('/')
        if len(parts) != 3:
            raise ValueError(f"Unknown date format: {date_str}")
        try:
            day, month, year = map(int, parts)
        except ValueError:
            raise ValueError(f"Unknown date format: {date_str}")

        if (1 <= day <= 31) and (1 <= month <= 12):
            return "DD/MM/YYYY"
        else:
            return "MM/DD/YYYY"
    else:
        raise ValueError(f"Unknown date format: {date_str}")
    

def detect_delimiter(first_line: str, delimiters: List[str]) -> str:
    """
    Определяет разделитель в CSV-файле на основе первой строки. 
    Принимает на вход строку и список допустимых разделителей.

    `first_line`: Первая строка CSV-файла.\n
    `delimiters`: Список допустимых разделителей.\n

    `return`: Разделитель из списка `delimiters`.
    """
    delimiter_counts = {delim: first_line.count(delim) for delim in delimiters}
    print("detect_delimiter", delimiter_counts)

    detected_delimiter = max(delimiter_counts, key=delimiter_counts.get)

    if delimiter_counts[detected_delimiter] == 0:
        raise ValueError("Couldn't identify separator in CSV file.")
    return detected_delimiter


def validate_csv_size(content: str, max_rows: int = 50) -> None:
    """
    Проверяет, что CSV-файл содержит не более указанного количества строк данных
    (не считая строки заголовков).
    
    Args:
        content: Содержимое CSV-файла в виде строки
        max_rows: Максимально допустимое количество строк данных
        
    Raises:
        ValueError: Если файл содержит слишком много строк
    """
    # Подсчет строк, исключая пустые и строку заголовков
    lines = [line for line in content.split('\n') if line.strip()]
    data_rows = len(lines) - 1  # Вычитаем строку заголовков
    
    if data_rows > max_rows:
        raise ValueError(f"The file contains too much data. The maximum allowed is {max_rows} rows, received {data_rows}.")