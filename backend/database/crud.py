from .models import WeatherForecast, TestModel
from typing import List, Dict
from sqlalchemy import asc


class CRUDBase:
    def __init__(self, model):
        self.model = model

    def get(self, db_session, id):
        return db_session.query(self.model).filter(self.model.id == id).first()

    def get_all(self, db_session, limit=100):
        query = db_session.query(self.model)
        if hasattr(self.model, 'date'):
            query = query.order_by(asc(self.model.date))
        query = query.limit(limit)
        return query.all()

    def create(self, db_session, obj_data: dict):
        obj = self.model(**obj_data)
        db_session.add(obj)
        db_session.commit()
        db_session.refresh(obj)
        return obj

    def bulk_create(self, db_session, objects_data: List[Dict]):
        """
        Массовое создание записей
        :param db_session: Сессия БД
        :param objects_data: Список словарей с данными для создания
        :return: Количество созданных записей
        """
        objects = [self.model(**data) for data in objects_data]
        db_session.bulk_save_objects(objects)
        db_session.commit()
        return len(objects)

    def bulk_delete(self, db_session, ids: list):
        """
        Массовое удаление записей по ID
        :param db_session: Сессия БД
        :param ids: Список ID для удаления
        :return: Количество удаленных записей
        """
        count = db_session.query(self.model).filter(self.model.id.in_(ids)).delete()
        db_session.commit()
        return count

    def update(self, db_session, db_obj, new_data: dict):
        for key, value in new_data.items():
            setattr(db_obj, key, value)
        db_session.commit()
        db_session.refresh(db_obj)
        return db_obj

    def delete(self, db_session, id):
        obj = db_session.query(self.model).filter(self.model.id == id).first()
        if obj:
            db_session.delete(obj)
            db_session.commit()
        return obj


weather_crud = CRUDBase(WeatherForecast) 
test_crud = CRUDBase(TestModel)

# Маппинг таблиц
TABLE_CRUD_MAPPING = {
    'weather_forecast': weather_crud,
    'test_forecast': test_crud
}

def get_crud_for_table(table_name: str):
    """Безопасное получение CRUD объекта"""
    crud = TABLE_CRUD_MAPPING.get(table_name)
    if not crud:
        raise ValueError(f"Unknown table: {table_name}")
    return crud
