from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool


SQLALCHEMY_DATABASE_URL = "postgresql://myuser:mypassword@database:5432/forecast_db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,  
    max_overflow=5,  
    pool_timeout=30,  
    pool_pre_ping=True
)
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
