class ConvertersConfig:
    """Конфигурация для модуля backend/converters"""
    
    # Максимальное количество строк в CSV/Excel файле
    MAX_FILE_ROWS = 500

    # Допустимые разделители для CSV (для автоопределения)
    CSV_DELIMITERS = [",", "\t", ";", " "]

    # Разделитель по умолчанию, если не удалось определить разделитель автоматически
    CSV_DEFAULT_DELIMETER = ","