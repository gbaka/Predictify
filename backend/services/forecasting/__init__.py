"""
Прогнозирование на основе выбранной модели.

Модуль содержит функцию для вызова моделей прогнозирования (например, ARIMA, LSTM) и 
получения прогноза на основе данных.

- forecast: Основная функция для прогнозирования, которая выбирает модель и возвращает результат.
"""

from typing import Dict

from .models import ARIMAModel
from .utils import extend_dates, is_camel_case, camel_to_snake

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
        ValueError: Если выбранная модель не поддерживается.
    """
    # print('----------------\n',data, model_type, settings, sep="\n-----------\n")

    # Кол-во шагов прогноза
    steps = settings.pop('steps')

    print(settings)

    # Преобразуем ключи словаря настроек settings из camelCase в snake_case
    for param in settings.copy().keys():
        if is_camel_case(param):
            settings[camel_to_snake(param)] = settings.pop(param)

    if model_type == "ARIMA":
        significance_level = settings.pop('significance_level')
        model = ARIMAModel(**settings)
        summary = model.fit(data).summary().as_text()

        prediction_result = model.detailed_forecast(steps)
        prediction_vals = prediction_result.predicted_mean.tolist()
        prediction_conf_ints = prediction_result.conf_int(significance_level).tolist()

        full_dates = extend_dates(data, steps)

        # res = model.detailed_forecast(steps)
        # print("Forecast:\n", prediction)
        # print("Detailed forecast:\n", res.predicted_mean.tolist())
        # print(res.conf_int(0.05).tolist())
        
        return {
            "summary" : summary,
            "prediction" : prediction_vals, 
            "confidence_intervals": prediction_conf_ints,
            "full_dates" : full_dates, 
            "endog" : data.get("endog")
        }
    
    # # elif model_type == "LSTM":
    # #     input_shape = (data.shape[1], 1)  # Определяем форму входных данных
    # #     model = LSTMModel(input_shape)
    # #     model.train(X_train, y_train, epochs=10)
    # #     return model.predict(X_input)
    
    else:
        raise ValueError("Неизвестная модель")
