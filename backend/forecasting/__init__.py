"""
Прогнозирование на основе выбранной модели.

Модуль содержит функцию для вызова моделей прогнозирования (например, ARIMA, LSTM) и 
получения прогноза на основе данных.

- forecast: Основная функция для прогнозирования, которая выбирает модель и возвращает результат.
"""


from .models import ARIMAModel

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

    if model_type == "ARIMA":
        settings["enforce_stationarity"] = settings.pop("enforceStationarity")
        settings["enforce_invertibility"] = settings.pop("enforceInvertibility")
        # print("[1] forecasting.__init__.py: HEREEEEE")
        model = ARIMAModel(**settings)
        # print("[2] forecasting.__init__.py: HEREEEEE")
        summary = model.fit(data).summary().as_text()
        prediction = model.predict().tolist()
        
        # print("[3] forecasting.__init__.py: HEREEEEE")
        return {
            "summary" : summary,
            "prediction" : prediction
        }
    
    # # elif model_type == "LSTM":
    # #     input_shape = (data.shape[1], 1)  # Определяем форму входных данных
    # #     model = LSTMModel(input_shape)
    # #     model.train(X_train, y_train, epochs=10)
    # #     return model.predict(X_input)
    
    else:
        raise ValueError("Неизвестная модель")
