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
            raise ValueError(f"Неизвестный формат даты: {date_str}")
        try:
            day, month, year = map(int, parts)
        except ValueError:
            raise ValueError(f"Неизвестный формат даты: {date_str}")

        if (1 <= day <= 31) and (1 <= month <= 12):
            return "DD/MM/YYYY"
        else:
            return "MM/DD/YYYY"
    else:
        raise ValueError(f"Неизвестный формат даты: {date_str}")
    

def detect_delimiter(first_line: str) -> str:
    """
    Определяет разделитель в CSV-файле на основе первой строки.

    `first_line`: Первая строка CSV-файла.\n
    `return`: Разделитель (",", ";", "\t", " ").
    """
    delimiters = [',', ';', '\t', ' ']
    delimiter_counts = {delim: first_line.count(delim) for delim in delimiters}
    print("detect_delimiter", delimiter_counts)

    detected_delimiter = max(delimiter_counts, key=delimiter_counts.get)

    if delimiter_counts[detected_delimiter] == 0:
        return ','
    return detected_delimiter