class CRUDBase:
    def __init__(self, model):
        self.model = model

    def get(self, db_session, id):
        return db_session.query(self.model).filter(self.model.id == id).first()

    def get_all(self, db_session, limit=100):
        return db_session.query(self.model).limit(limit).all()

    def create(self, db_session, obj_data: dict):
        obj = self.model(**obj_data)
        db_session.add(obj)
        db_session.commit()
        db_session.refresh(obj)
        return obj

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
