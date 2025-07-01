"""
Настраиваемый логгер приложения с выводом в консоль и логфайл.
"""

import sys
import logging
from pathlib import Path
from logging.handlers import RotatingFileHandler


class Logger:
    def __init__(self, name: str = "app", log_dir: str = "logs", log_file: str = "app.log"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        self._setup_handlers(log_dir, log_file)

    def _setup_handlers(self, log_dir: str, log_file: str):
        if self.logger.hasHandlers():
            return  # Не дублируем хендлеры при повторном вызове

        formatter = logging.Formatter("[%(asctime)s] [%(levelname)s]: %(message)s",  datefmt="%Y-%m-%d %H:%M:%S")

        # stdout
        stream_handler = logging.StreamHandler(sys.stdout)
        stream_handler.setFormatter(formatter)
        self.logger.addHandler(stream_handler)

        # file
        Path(log_dir).mkdir(exist_ok=True)
        file_handler = RotatingFileHandler(f"{log_dir}/{log_file}", maxBytes=5_000_000, backupCount=5)
        file_handler.setFormatter(formatter)
        self.logger.addHandler(file_handler)

    def get_logger(self):
        return self.logger
