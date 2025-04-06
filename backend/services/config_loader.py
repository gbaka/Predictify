import yaml
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any

class ConfigLoader:
    def __init__(self, config_path: str):
        """
        Загружает конфигурацию из YAML-файла с поддержкой !py3 тегов.
        
        Args:
            config_path: Путь к YAML-файлу конфигурации
        """
        self.config_path = Path(config_path)
        self._config = None
        self._tasks = None
        
        # Регистрируем конструктор для !py3 тега
        yaml.SafeLoader.add_constructor('!py3', self._py3_constructor)

    def _py3_constructor(self, loader: yaml.SafeLoader, node: yaml.Node) -> Any:
        """Обработчик для тега !py3"""
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
        """Загружает и парсит конфигурационный файл"""
        with open(self.config_path, 'r') as f:
            self._config = yaml.safe_load(f)
        self._tasks = self._config.get('tasks', [])

    @property
    def tasks(self) -> List[Dict[str, Any]]:
        """Возвращает список всех задач (tasks)"""
        if self._tasks is None:
            self.load()
        return self._tasks

    def get_task(self, task_name: str) -> Dict[str, Any]:
        """
        Возвращает конфигурацию задачи по имени.
        
        Args:
            task_name: Имя задачи (name из конфига)
            
        Returns:
            Словарь с конфигурацией задачи
            
        Raises:
            ValueError: Если задача не найдена
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