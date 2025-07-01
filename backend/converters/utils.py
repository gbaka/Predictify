"""
Утилиты для работы с форматами даты и разделителями CSV.

Модуль содержит функции для определения формата даты, разделителя CSV и проверки размера CSV-файла.
"""

from typing import List


def detect_date_format(date_str: str) -> str:
    """
    Определяет формат даты на основе переданной строки.

    Parameters
    ----------
    date_str : str
        Строка с датой.

    Returns
    -------
    str
        Формат даты: "YYYY-MM-DD", "DD.MM.YYYY", "MM/DD/YYYY" или "DD/MM/YYYY".

    Raises
    ------
    ValueError
        Если формат даты не распознан.
    """
    if "-" in date_str:
        return "YYYY-MM-DD"  # ISO 8601
    elif "." in date_str:
        return "DD.MM.YYYY"
    elif "/" in date_str:
        parts = date_str.split("/")
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


def detect_delimiter(
    first_line: str, delimiters: List[str], default_delimeter: str
) -> str:
    """
    Определяет разделитель в CSV-файле на основе первой строки.

    Parameters
    ----------
    first_line : str
        Первая строка CSV-файла.
    delimiters : List[str]
        Список допустимых разделителей.
    default_delimeter : str
        Разделитель по умолчанию.

    Returns
    -------
    str
        Определённый разделитель из списка или разделитель по умолчанию.
    """
    delimiter_counts = {delim: first_line.count(delim) for delim in delimiters}
    detected_delimiter = max(delimiter_counts, key=delimiter_counts.get)

    if delimiter_counts[detected_delimiter] == 0:
        return default_delimeter
    return detected_delimiter


def validate_csv_size(content: str, max_rows: int = 50) -> None:
    """
    Проверяет, что CSV-файл содержит не более указанного количества строк данных
    (не считая строки заголовков).

    Parameters
    ----------
    content : str
        Содержимое CSV-файла в виде строки.
    max_rows : int, optional
        Максимально допустимое количество строк данных (по умолчанию 50).

    Raises
    ------
    ValueError
        Если количество строк данных превышает максимально допустимое.
    """
    # Подсчет строк, исключая пустые и строку заголовков
    lines = [line for line in content.split("\n") if line.strip()]
    data_rows = len(lines) - 1  # Вычитаем строку заголовков

    if data_rows > max_rows:
        raise ValueError(
            f"The file contains too much data. The maximum allowed is {max_rows} rows, received {data_rows}."
        )
