"""
API-эндпоинты для взаимодействия с пользователем.

Модуль описывает маршруты API, которые обрабатывают запросы для прогнозирования на основе 
временных рядов. В данном случае используется эндпоинт "/forecast", который принимает запросы 
с данными и возвращает прогноз.

- get_forecast: Обрабатывает запрос на прогноз и возвращает результаты.
"""

from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from api.models import ForecastRequest, ForecastResponse
from forecasting import forecast
from converters import convert_to_dict
from json import loads


router = APIRouter()

# @router.post("/forecast", response_model=ForecastResponse)
# async def get_forecast(request: ForecastRequest):
#     """
#     Эндпоинт для получения прогноза на основе временного ряда.

#     Параметры:
#         request (ForecastRequest): Объект запроса, содержащий данные для прогнозирования
#                                     и выбор модели.

#     Возвращаемое значение:
#         ForecastResponse: Объект ответа с моделью и прогнозом.
#     """
#     prediction = forecast(request.data, model_type=request.model)
#     return ForecastResponse(model=request.model, prediction=prediction)


@router.post("/test")
async def test(
    selectedModel: str = Form(...),
    modelSettings: str = Form(...),
    uploadedData: UploadFile = File(...)
):
    
    model_settings_dict = loads(modelSettings)


    print(f"Selected model: {selectedModel}")
    print(f"Model settings: {model_settings_dict}")
    print(f"File filename: {uploadedData.filename}")
    print(f"file:", type(uploadedData))


    try:
        file_data_dict = convert_to_dict(uploadedData)
        print(f"File converted to dict:", file_data_dict)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error processing file: {str(e)}"
        )
    
    try:
        res = forecast(data=file_data_dict, model_type=selectedModel, settings=model_settings_dict)
        print(res)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error creating forecast: {str(e)}"
        )
        
    return res
