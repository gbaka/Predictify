"""
API-эндпоинты для взаимодействия с пользователем.

Модуль описывает маршруты API, которые обрабатывают запросы для прогнозирования на основе 
временных рядов. В данном случае используется эндпоинт "/forecast", который принимает запросы 
с данными и возвращает прогноз.

- get_forecast: Обрабатывает запрос на прогноз и возвращает результаты.
"""

from fastapi import APIRouter
from api.models import ForecastRequest, ForecastResponse
from forecasting.predictor import forecast


router = APIRouter()

@router.post("/forecast", response_model=ForecastResponse)
async def get_forecast(request: ForecastRequest):
    """
    Эндпоинт для получения прогноза на основе временного ряда.

    Параметры:
        request (ForecastRequest): Объект запроса, содержащий данные для прогнозирования
                                    и выбор модели.

    Возвращаемое значение:
        ForecastResponse: Объект ответа с моделью и прогнозом.
    """
    prediction = forecast(request.data, model_type=request.model)
    return ForecastResponse(model=request.model, prediction=prediction)


@router.post("/test")
async def test(request: dict):
    print(request)
    return request
