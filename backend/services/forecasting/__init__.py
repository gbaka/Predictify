"""
Прогнозирование на основе выбранной модели.

Модуль содержит функцию для вызова моделей прогнозирования (например, ARIMA, LSTM) и 
получения прогноза на основе данных.

- forecast: Основная функция для прогнозирования, которая выбирает модель и возвращает результат.
"""


from .models import ARIMAModel
from .utils import extend_dates, is_camel_case, camel_to_snake

def forecast(data: dict, model_type: str, settings: dict):
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
    print('----------------\n',data, model_type, settings, sep="\n-----------\n")

    # Кол-во шагов прогноза
    steps = settings.pop('steps')

    # Преобразуем ключи словаря настроек settings из camelCase в snake_case
    for param in settings.copy().keys():
        if is_camel_case(param):
            settings[camel_to_snake(param)] = settings.pop(param)

    if model_type == "ARIMA":
        model = ARIMAModel(**settings)
        summary = model.fit(data).summary().as_text()
        prediction = model.predict(steps).tolist()
        full_dates = extend_dates(data, steps)
        
        return {
            "summary" : summary,
            "prediction" : prediction, 
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
