"""
API-эндпоинты для взаимодействия с пользователем.

Модуль описывает маршруты API, которые обрабатывают запросы для прогнозирования на основе
временных рядов. В данном случае используется эндпоинт "/forecast", который принимает запросы
с данными и возвращает прогноз.

- get_forecast: Обрабатывает запрос на прогноз и возвращает результаты.
"""

from json import loads
import traceback
import asyncio

from fastapi import APIRouter, File, Form, UploadFile, HTTPException, Request

from services.forecasting import forecast
from converters import convert_to_dict
from database import get_db_session
from database.crud import get_crud_for_table, TABLE_CRUD_MAPPING
from .utils import format_db_forecast_data, validate_file_size
from .config import ApiConfig
from logger import Logger


logger = Logger().get_logger()
router = APIRouter()


@router.post("/forecast")
async def forecast_endpoint(
    request: Request,
    selectedModel: str = Form(...),
    modelSettings: str = Form(...),
    uploadedData: UploadFile = File(...),
    fileSettings: str = Form(...),
):
    logger.info(f"[POST /forecast] Запрос получен. Файл: {uploadedData.filename}")

    try:
        file_settings_dict = loads(fileSettings)
        model_settings_dict = loads(modelSettings)
        logger.debug(f"Параметры успешно загружены. Модель: {selectedModel}")
    except Exception as e:
        logger.error(f"Ошибка при разборе параметров: {e}")
        raise HTTPException(status_code=400, detail=f"Error loading file: {str(e)}")

    try:
        validate_file_size(uploadedData, ApiConfig.MAX_FILE_SIZE)
        logger.debug(f"Файл прошёл проверку размера: {uploadedData.size} байт")
        file_data_dict = convert_to_dict(file=uploadedData, settings=file_settings_dict)
        logger.debug("Файл успешно преобразован в словарь")
    except Exception as e:
        logger.error(f"Ошибка при обработке файла: {e}")
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

    try:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            request.app.state.forecasting_process_pool,
            forecast,
            file_data_dict,
            selectedModel,
            model_settings_dict,
        )
        logger.info("Прогноз успешно построен")
    except Exception as e:
        logger.error(f"Ошибка при построении прогноза: {e}\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=400, detail=f"Error creating forecast: {str(e)}"
        )

    return response


@router.get("/forecasts-from-parsers")
def forecasts_from_parsers_endpoint():
    logger.info("[GET /forecasts-from-parsers] Запрос на получение прогнозов из БД")

    try:
        db_session = next(get_db_session())
        forecast_tables = TABLE_CRUD_MAPPING.keys()
        response = {}

        for tablename in forecast_tables:
            crud = get_crud_for_table(tablename)
            instances = crud.get_all(
                db_session, limit=ApiConfig.MAX_SAMPLES_FROM_PARSERS
            )
            logger.debug(f"{len(instances)} записей загружено из таблицы '{tablename}'")
            response[tablename] = format_db_forecast_data(instances)

        logger.info("Прогнозы для данных из парсеров успешно получены")
    except Exception as e:
        logger.error(
            f"Ошибка при извлечении данных из БД: {e}\n{traceback.format_exc()}"
        )
        raise HTTPException(
            status_code=400, detail=f"Error fetching the data from DB: {str(e)}"
        )
    finally:
        db_session.close()

    return response
