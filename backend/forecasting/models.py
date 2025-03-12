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
    def __init__(self, order=(5, 1, 0)):
        self.order = order
        self.model = None

    def fit(self, data):
        """
        Обучение модели ARIMA на данных.

        Параметры:
            data (List[float]): Данные временного ряда для обучения.
        """
        self.model = ARIMA(data, order=self.order)
        self.model = self.model.fit()

    def predict(self, steps=10):
        """
        Прогнозирование значений на заданное количество шагов вперёд.

        Параметры:
            steps (int): Количество шагов для прогноза.

        Возвращаемое значение:
            List[float]: Список прогнозируемых значений.
        """
        return self.model.forecast(steps=steps)
