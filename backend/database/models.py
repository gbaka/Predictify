from sqlalchemy import Column, Float, Integer, TIMESTAMP
from sqlalchemy.sql import func
from database import Base

# Модели должны соответствовать таблицам, создаваемым в /backend/database/init.sql

class ForecastBase(Base):
    __abstract__ = True 
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(TIMESTAMP, nullable=False)
    endog = Column(Float, nullable=False)
    predict = Column(Float)
    ci_low = Column(Float)
    ci_up = Column(Float)
    created_at = Column(TIMESTAMP, server_default=func.now())

class WeatherForecast(ForecastBase):
    __tablename__ = "weather_forecast"

class TestModel(ForecastBase):
    __tablename__ = "test"