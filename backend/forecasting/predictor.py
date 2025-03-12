"""
Прогнозирование на основе выбранной модели.

Модуль содержит функцию для вызова моделей прогнозирования (например, ARIMA, LSTM) и 
получения прогноза на основе данных.

- forecast: Основная функция для прогнозирования, которая выбирает модель и возвращает результат.
"""


from models import ARIMAModel

def forecast(data, model_type="ARIMA", steps=10):
    """
    Прогнозирование на основе выбранной модели.

    Параметры:
        data (List[float]): Данные временного ряда для прогнозирования.
        model_type (str): Тип модели для прогнозирования, например "ARIMA".
        steps (int): Количество шагов вперёд для прогноза.

    Возвращаемое значение:
        List[float]: Прогнозируемые значения на заданное количество шагов.
    
    Исключения:
        ValueError: Если выбранная модель не поддерживается.
    """
    if model_type == "ARIMA":
        model = ARIMAModel(order=(5, 1, 0))
        model.fit(data)
        return model.predict(steps=steps)
    
    elif model_type == "LSTM":
        input_shape = (data.shape[1], 1)  # Определяем форму входных данных
        model = LSTMModel(input_shape)
        model.train(X_train, y_train, epochs=10)
        return model.predict(X_input)
    
    else:
        raise ValueError("Неизвестная модель")
