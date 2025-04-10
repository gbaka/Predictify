from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


SQLALCHEMY_DATABASE_URL = "postgresql://myuser:mypassword@db:5432/forecast_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
print("Engine has been successfully created!")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db_session():
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()


def init_db():
    from . import models  
    Base.metadata.create_all(bind=engine)