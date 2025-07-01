"""
CRUD-операции для моделей прогнозных данных.

Модуль содержит базовый класс CRUDBase для стандартных операций с БД,
а также инициализирует объекты CRUD для конкретных моделей прогнозов.
"""

from .models import TemperatureForecast, RelativeHumidityForecast, WindSpeedForecast, PrecipitationForecast
from typing import List, Dict
from sqlalchemy import asc


class CRUDBase:
    """
    Базовый класс для CRUD-операций с моделью SQLAlchemy.

    Parameters
    ----------
    model : SQLAlchemy модель
        Модель, с которой будут выполняться операции.
    """

    def __init__(self, model):
        self.model = model

    def get(self, db_session, id):
        """
        Получить объект по ID.

        Parameters
        ----------
        db_session : Session
            Сессия базы данных.
        id : int
            Идентификатор объекта.

        Returns
        -------
        Объект модели или None, если не найден.
        """
        return db_session.query(self.model).filter(self.model.id == id).first()

    def get_all(self, db_session, limit=100):
        """
        Получить список объектов, отсортированных по дате, если поле date есть.

        Parameters
        ----------
        db_session : Session
            Сессия базы данных.
        limit : int, optional
            Максимальное количество объектов для выборки (по умолчанию 100).

        Returns
        -------
        List[model]
            Список объектов модели.
        """
        query = db_session.query(self.model)
        if hasattr(self.model, 'date'):
            query = query.order_by(asc(self.model.date))
        query = query.limit(limit)
        return query.all()

    def create(self, db_session, obj_data: dict):
        """
        Создать новый объект.

        Parameters
        ----------
        db_session : Session
            Сессия базы данных.
        obj_data : dict
            Данные для создания объекта.

        Returns
        -------
        Объект модели.
        """
        obj = self.model(**obj_data)
        db_session.add(obj)
        db_session.commit()
        db_session.refresh(obj)
        return obj

    def bulk_create(self, db_session, objects_data: List[Dict]):
        """
        Массовое создание записей.

        Parameters
        ----------
        db_session : Session
            Сессия базы данных.
        objects_data : List[Dict]
            Список словарей с данными для создания.

        Returns
        -------
        int
            Количество созданных записей.
        """
        objects = [self.model(**data) for data in objects_data]
        db_session.bulk_save_objects(objects)
        db_session.commit()
        return len(objects)

    def bulk_delete(self, db_session, ids: list):
        """
        Массовое удаление записей по ID.

        Parameters
        ----------
        db_session : Session
            Сессия базы данных.
        ids : list
            Список ID для удаления.

        Returns
        -------
        int
            Количество удаленных записей.
        """
        count = db_session.query(self.model).filter(self.model.id.in_(ids)).delete()
        db_session.commit()
        return count

    def update(self, db_session, db_obj, new_data: dict):
        """
        Обновить объект новыми данными.

        Parameters
        ----------
        db_session : Session
            Сессия базы данных.
        db_obj : model
            Объект модели для обновления.
        new_data : dict
            Новые данные для объекта.

        Returns
        -------
        Обновленный объект модели.
        """
        for key, value in new_data.items():
            setattr(db_obj, key, value)
        db_session.commit()
        db_session.refresh(db_obj)
        return db_obj

    def delete(self, db_session, id):
        """
        Удалить объект по ID.

        Parameters
        ----------
        db_session : Session
            Сессия базы данных.
        id : int
            Идентификатор объекта.

        Returns
        -------
        Удаленный объект или None, если не найден.
        """
        obj = db_session.query(self.model).filter(self.model.id == id).first()
        if obj:
            db_session.delete(obj)
            db_session.commit()
        return obj


temperature_crud = CRUDBase(TemperatureForecast) 
relative_humidity_crud =  CRUDBase(RelativeHumidityForecast)
wind_speed_crud = CRUDBase(WindSpeedForecast)
precipitation_crud = CRUDBase(PrecipitationForecast)

# Маппинг таблица
TABLE_CRUD_MAPPING = {
    'temperature_forecast': temperature_crud,
    'relative_humidity_forecast': relative_humidity_crud,
    'wind_speed_forecast': wind_speed_crud,
    'precipitation_forecast': precipitation_crud
}

def get_crud_for_table(table_name: str):
    """
    Безопасно получить CRUD объект по имени таблицы.

    Parameters
    ----------
    table_name : str
        Имя таблицы.

    Returns
    -------
    CRUDBase
        Объект CRUD для указанной таблицы.

    Raises
    ------
    ValueError
        Если таблица не найдена.
    """
        
    crud = TABLE_CRUD_MAPPING.get(table_name)
    if not crud:
        raise ValueError(f"Unknown table: {table_name}")
    return crud
