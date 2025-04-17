from sqlalchemy import Column, Float, Integer, Text, TIMESTAMP
from sqlalchemy.sql import func
from database import Base

# Модели должны соответствовать таблицам, создаваемым в /backend/database/init.sql

class ForecastBase(Base):
    __abstract__ = True 
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    date = Column(TIMESTAMP, nullable=False, index=True)
    endog = Column(Float)
    predict = Column(Float)
    ci_low = Column(Float)
    ci_up = Column(Float)
    conf_level = Column(Float)
    absolute_error = Column(Float)
    last_summary = Column(Text)
  
class WeatherForecast(ForecastBase):
    __tablename__ = "weather_forecast"

class TestModel(ForecastBase):
    __tablename__ = "test"