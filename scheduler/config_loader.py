"""
Модуль для загрузки конфигурации задач из YAML-файла.

Позволяет описывать параметры задач и расписания в виде YAML, включая поддержку 
динамических выражений через специальный тег `!py3`, который позволяет использовать 
объекты `datetime`, `timedelta`, `datetime.now()` прямо в YAML.

Используется в планировщике задач для определения расписания и параметров прогнозирования.
"""

from pathlib import Path
from datetime import datetime, timedelta
from typing import List, Dict, Any
import yaml


class ConfigLoader:
    """
    Класс для загрузки и управления YAML-конфигурацией задач.

    Поддерживает специальный YAML-тег `!py3` для динамических выражений.
    """

    def __init__(self, config_path: str):
        """
        Инициализация загрузчика конфигурации.

        Parameters
        ----------
        config_path : str
            Путь к YAML-файлу конфигурации.
        """
        self.config_path = Path(config_path)
        self._config = None
        self._tasks = None
        
        # Регистрируем конструктор для !py3 тега
        yaml.SafeLoader.add_constructor('!py3', self._py3_constructor)

    def _py3_constructor(self, loader: yaml.SafeLoader, node: yaml.Node) -> Any:
        """
        Обработчик пользовательского YAML-тега `!py3`.

        Позволяет использовать выражения Python (datetime, timedelta, now)
        прямо в конфигурационном файле.

        Parameters
        ----------
        loader : yaml.SafeLoader
            YAML загрузчик.
        node : yaml.Node
            Узел с !py3-значением.

        Returns
        -------
        Any
            Результат выполнения выражения.

        Raises
        ------
        ValueError
            В случае ошибки выполнения выражения.
        """
        value = loader.construct_scalar(node)
        try:
            return eval(
                value.strip(),
                {
                    'datetime': datetime,
                    'timedelta': timedelta,
                    'now': datetime.now
                }
            )
        except Exception as e:
            raise ValueError(f"Error evaluating !py3 expression '{value}': {str(e)}")

    def load(self) -> None:
        """
        Загружает YAML-файл конфигурации и сохраняет список задач.
        """
        with open(self.config_path, 'r') as f:
            self._config = yaml.safe_load(f)
        self._tasks = self._config.get('tasks', [])

    @property
    def tasks(self) -> List[Dict[str, Any]]:
        """
        Список задач.

        Returns
        -------
        List[Dict[str, Any]]
            Список словарей с параметрами задач.
        """
        if self._tasks is None:
            self.load()
        return self._tasks

    def get_task(self, task_name: str) -> Dict[str, Any]:
        """
        Получает конфигурацию задачи по имени.

        Parameters
        ----------
        task_name : str
            Имя задачи (значение `name` в конфиге).

        Returns
        -------
        Dict[str, Any]
            Словарь с параметрами задачи.

        Raises
        ------
        ValueError
            Если задача с указанным именем не найдена.
        """
        for task in self.tasks:
            if task.get('name') == task_name:
                return task
        raise ValueError(f"Task '{task_name}' not found in config")


# Тестирование
if __name__ == "__main__":
    loader = ConfigLoader("./scheduler_config.yml")
    tasks = loader.tasks
    from json import dumps
    print(dumps(tasks, indent=4))