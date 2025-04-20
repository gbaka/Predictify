"""
API-эндпоинты для взаимодействия с пользователем.

Модуль описывает маршруты API, которые обрабатывают запросы для прогнозирования на основе 
временных рядов. В данном случае используется эндпоинт "/forecast", который принимает запросы 
с данными и возвращает прогноз.

- get_forecast: Обрабатывает запрос на прогноз и возвращает результаты.
"""

from concurrent.futures import ProcessPoolExecutor
from contextlib import asynccontextmanager
from datetime import datetime
from json import loads
import traceback
import asyncio

from fastapi import APIRouter, File, Form, UploadFile, HTTPException, Request

from services.forecasting import forecast
from converters import convert_to_dict
from database import get_db_session
from database.crud import get_crud_for_table
from .utils import format_db_forecast_data


# Максимальное кол-во записей которые мы извлекаем из бд для отображения на фронте 
MAX_SAMPLES_FROM_PARSERS  = 300

router = APIRouter()


@router.post("/test")
async def test(
    request: Request,
    selectedModel: str = Form(...),
    modelSettings: str = Form(...),
    uploadedData: UploadFile = File(...),
    fileSettings: str = Form(...)
):
    print("TEST")
    try:  
        file_settings_dict = loads(fileSettings)
        model_settings_dict = loads(modelSettings)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error loading file: {str(e)}"
        )
    
    # print(f"File settings: {file_settings_dict}")
    # print(f"Selected model: {selectedModel}")
    # print(f"Model settings: {model_settings_dict}")
    # print(f"File filename: {uploadedData.filename}")
    # print(f"file:", type(uploadedData))

    try:
        file_data_dict = convert_to_dict(file=uploadedData, settings=file_settings_dict)
        print(f"File converted to dict:", file_data_dict)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error processing file: {str(e)}"
        )
    
    try:
        # Построение прогноза в текущем процессе
        # response = forecast(data=file_data_dict, model_type=selectedModel, settings=model_settings_dict)

        # Построение прогнозов в отдельных процессах
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            request.app.state.forecasting_process_pool,
            forecast,  
            file_data_dict,
            selectedModel,
            model_settings_dict
        )
    except Exception as e:
        print("-"*50, '\n',e, traceback.format_exc(), "\n"+"-"*50 + '\n')
        raise HTTPException(
            status_code=400,
            detail=f"Error creating forecast: {str(e)}"
        )

    return response


@router.get("/forecasts-from-parsers")
def get_forecasts():

    try:
    # print("Получаем данные через CRUD")
        db = next(get_db_session())

        forecast_tables = ['weather_forecast', 'test_forecast']
        response = {}
        for tablename in forecast_tables:
            crud = get_crud_for_table(tablename)
            instances = crud.get_all(db,limit=MAX_SAMPLES_FROM_PARSERS)
            response[tablename] = format_db_forecast_data(instances)
        print("RESPONSE:", response)
    except Exception as e:
        print("-"*50, '\n',e, traceback.format_exc(), "\n"+"-"*50 + '\n')
        raise HTTPException(
            status_code=400,
            detail=f"Error fetching the data from DB: {str(e)}"
        )
    
    return response
