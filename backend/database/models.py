"""
Модели базы данных для хранения прогнозов.

Содержит базовый класс ForecastBase и конкретные модели
для различных типов прогнозов: температуры, влажности, скорости ветра и осадков.
"""

from sqlalchemy import Column, Float, Integer, Text, TIMESTAMP
from sqlalchemy.sql import func
from database import Base


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
  
class TemperatureForecast(ForecastBase):
    __tablename__ = "temperature_forecast"

class RelativeHumidityForecast(ForecastBase):
    __tablename__ = "relative_humidity_forecast"

class WindSpeedForecast(ForecastBase):
    __tablename__ = "wind_speed_forecast"

class PrecipitationForecast(ForecastBase):
    __tablename__ = "precipitation_forecast"