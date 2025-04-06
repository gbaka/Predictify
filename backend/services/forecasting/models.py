"""
Модели прогнозирования временных рядов.

Этот модуль содержит реализации различных моделей прогнозирования, например, ARIMA, 
которые могут быть использованы для анализа и предсказания временных рядов.

- ARIMAModel: Класс для работы с моделью ARIMA (AutoRegressive Integrated Moving Average).
"""


from statsmodels.tsa.arima.model import ARIMA

class ARIMAModel:
    """
    Модель ARIMA для прогнозирования временных рядов.

    Атрибуты:
        order (tuple): Параметры модели ARIMA (p, d, q), где:
                        - p: порядок авторегрессии
                        - d: степень дифференцирования
                        - q: порядок скользящего среднего
        model (ARIMA): Объект модели ARIMA после её подгонки.

    Методы:
        fit(data): Обучение модели на данных.
        predict(steps=10): Прогнозирование на заданное количество шагов вперёд.
    """

    def __init__(self, p: float, d: float, q: float, trend: str, enforce_stationarity: bool, enforce_invertibility: bool):
        self.settings = {
            "order" : (p,d,q), 
            "trend" : trend, 
            "enforce_stationarity" : enforce_stationarity,
            "enforce_invertibility" : enforce_invertibility
        }
        self.model = None

    def fit(self, data: dict):
        """
        Обучение модели ARIMA на данных.

        Параметры:
            data (List[float]): Данные временного ряда для обучения.
        """

        print("FIT", data["endog"], type(data["endog"]))
        self.model = ARIMA(**data, **self.settings)
        self.model = self.model.fit()
        return self.model

    def forecast(self, steps: int):
        """
        Прогнозирование значений на заданное количество шагов вперёд.

        Параметры:
            steps (int): Количество шагов для прогноза.

        Возвращаемое значение:
            List[float]: Список прогнозируемых значений.
        """
        return self.model.forecast(steps=steps)
    
    def detailed_forecast(self, steps: int): 
        """
        Прогнозирование значений на заданное количество шагов вперёд, 
        а также доверительных интервалов и метрик точности.

        Параметры:
            steps (int): Количество шагов для прогноза.

        Возвращаемое значение:
            PredictionResults: Результаты прогнозирования.
        """
        return self.model.get_forecast(steps=steps)
    
    
