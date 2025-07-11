"""Константы конфигурации API модуля."""

class ApiConfig:
    """Конфигурация параметров API.

    Attributes
    ----------
    MAX_SAMPLES_FROM_PARSERS : int
        Максимальное количество записей (точек временного ряда), извлекаемых из базы данных для отображения на фронте.
    
    MAX_FILE_SIZE : int
        Максимально допустимый размер загружаемого файла в байтах.
    """

    MAX_SAMPLES_FROM_PARSERS = 300
    MAX_FILE_SIZE = 1024 * 100