"""
Прогнозирование на основе выбранной модели.

Модуль содержит функцию для вызова моделей прогнозирования (например, ARIMA, LSTM) и 
получения прогноза на основе данных.

- forecast: Основная функция для прогнозирования, которая выбирает модель и возвращает результат.
"""

from typing import Dict

from .models import SARIMAXModel, ExponentialSmoothingModel
from .utils import extend_dates, is_camel_case, camel_to_snake, validate_no_nans

def forecast(data: Dict, model_type: str, settings: Dict):
    """
    Прогнозирование на основе выбранной модели.

    Параметры:
        data (dict): Данные временного ряда для прогнозирования.
        model_type (str): Тип модели для прогнозирования, например "ARIMA".
        settings (dict): Количество шагов вперёд для прогноза.

    Возвращаемое значение:
        List[float]: Прогнозируемые значения на заданное количество шагов.
    
    Исключения:
        ValueError: Если выбранная модель не поддерживается или в прогнозах найдены NaN значения.
    """
    # print('----------------\n',data, model_type, settings, sep="\n-----------\n")

    # Сообщения в случае ошибок
    nan_found_message = "Обнаружены NaN значения в данных прогноза"
    unknown_model_message = "Неизвестная модель"

    # Кол-во шагов прогноза
    steps = settings.pop('steps')
    
    print(settings)
    print(model_type)

    # Преобразуем ключи словаря настроек settings из camelCase в snake_case
    for param in settings.copy().keys():
        if is_camel_case(param):
            settings[camel_to_snake(param)] = settings.pop(param)

    if model_type in ['SARIMA', 'ARIMA', 'ARMA', 'AR', 'MA']:
        significance_level = settings.pop('significance_level')
        model = SARIMAXModel(**settings)
        summary = model.fit(data).summary().as_text()

        prediction_result = model.detailed_forecast(steps)
        prediction_vals = prediction_result.predicted_mean
        validate_no_nans(prediction_vals, nan_found_message)
        prediction_conf_ints = prediction_result.conf_int(alpha=significance_level).tolist()

        full_dates = extend_dates(data, steps)
        
        return {
            "summary" : summary,  
            "full_dates" : full_dates, 
            "endog" : data.get("endog"),
            "prediction" : prediction_vals.tolist(), 
            "confidence_intervals": {
                "intervals" : prediction_conf_ints,
                "confidence_level" : round(1-significance_level, 2)
            }
        }
    
    elif model_type in ['HWES', 'HES', 'SES']:
        if settings['initialization_method'] != 'known':
            settings.pop('initial_level', None)
            settings.pop('initial_trend', None)
        if 'exponential' in settings.keys():
            exponential = settings.pop('exponential')
            settings['trend'] = 'mul' if exponential else 'add'
        if settings.get('trend', None) == 'none':
            settings['trend'] = None
        if settings.get('seasonal', None) == 'none':
            settings['seasonal'] = None
 
        model = ExponentialSmoothingModel(**settings)
        full_dates = extend_dates(data, steps)
        summary = model.fit(data).summary().as_text()

        prediction_vals = model.forecast(steps)
        validate_no_nans(prediction_vals, nan_found_message)

        return {
            "summary" : summary,  
            "full_dates" : full_dates, 
            "endog" : data.get("endog"),
            "prediction" : prediction_vals.tolist(), 
            "confidence_intervals": {
                "intervals" : None,
                "confidence_level" : None
            }
        }
    
    else:
        raise ValueError(unknown_model_message)
