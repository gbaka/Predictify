"""
Модели прогнозирования временных рядов.

Этот модуль содержит реализации различных моделей прогнозирования, например, SARIMAX, 
которые могут быть использованы для анализа и предсказания временных рядов.

- SARIMAXModel: Класс для работы с моделью SARIMAX (Seasonal AutoRegressive Integrated Moving Average with eXogenous regressors).
- SimpleExpSmoothingModel: Класс для простого экспоненциального сглаживания.
"""

from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.holtwinters import SimpleExpSmoothing, Holt, ExponentialSmoothing


class SARIMAXModel:
    """Модель SARIMAX для прогнозирования временных рядов.

    Attributes
    ----------
    order : tuple
        Параметры несезонной части модели (p, d, q), где:
        - p: порядок авторегрессии (AR)
        - d: степень дифференцирования (I)
        - q: порядок скользящего среднего (MA)
    seasonal_order : tuple
        Параметры сезонной части модели (P, D, Q, s), где:
        - P: сезонный порядок авторегрессии
        - D: сезонная степень дифференцирования
        - Q: сезонный порядок скользящего среднего 
        - s: количество периодов в сезоне (например 12 для месячных данных)
    model : SARIMAX
        Объект модели SARIMAX после её подгонки.

    Methods
    -------
    fit(data)
        Обучение модели на данных.
    predict(steps=10)
        Прогнозирование на заданное количество шагов вперёд.
    """

    def __init__(
        self,
        p: int = 0,
        d: int = 0,
        q: int = 0,
        P: int = 0,
        D: int = 0,
        Q: int = 0,
        s: int = 0,
        trend: str = None,
        enforce_stationarity: bool = True,
        enforce_invertibility: bool = True,
    ):
        self.settings = {
            "order": (p, d, q),
            "seasonal_order": (P, D, Q, s),
            "trend": trend,
            "enforce_stationarity": enforce_stationarity,
            "enforce_invertibility": enforce_invertibility,
        }
        self.model = None

    def fit(self, data: dict):
        """Обучение модели SARIMAX на данных.

        Parameters
        ----------
        data : List[float]
            Данные временного ряда для обучения.
        """
        self.model = SARIMAX(**data, **self.settings)
        self.model = self.model.fit()
        return self.model

    def forecast(self, steps: int):
        """Прогнозирование значений на заданное количество шагов вперёд.

        Parameters
        ----------
        steps : int
            Количество шагов для прогноза.

        Returns
        -------
        List[float]
            Список прогнозируемых значений.
        """
        return self.model.forecast(steps=steps)

    def detailed_forecast(self, steps: int): 
        """Прогнозирование значений на заданное количество шагов вперёд, 
        а также доверительных интервалов и метрик точности.

        Parameters
        ----------
        steps : int
            Количество шагов для прогноза.

        Returns
        -------
        PredictionResults
            Результаты прогнозирования.
        """
        return self.model.get_forecast(steps=steps)


class ExponentialSmoothingModel:
    """Модель тройного экспоненциального сглаживания Холта-Винтерса для прогнозирования временных рядов.

    Attributes
    ----------
    model : ExponentialSmoothing
        Объект модели после её подгонки.

    Methods
    -------
    fit(data)
        Обучение модели на данных.
    forecast(steps=10)
        Прогнозирование на заданное количество шагов вперёд.
    """

    def __init__(
        self,
        initialization_method: str = None,
        initial_level: float = None,
        initial_trend: float = None,
        trend: str = None,
        seasonal: str = None,
        seasonal_periods: int = None,
        damped_trend: bool = False,
    ):
        """
        Parameters
        ----------
        initialization_method : str, optional
            Метод инициализации ('known', 'heuristic', 'estimated').
        initial_level : float, optional
            Начальный уровень (требуется при initialization_method='known').
        initial_trend : float, optional
            Начальный тренд (требуется при initialization_method='known').
        trend : str, optional
            Тип трендовой компоненты:
        seasonal : str, optional
            Тип сезонной компоненты:
        seasonal_periods : int, optional
            Количество периодов в полном сезонном цикле.
        exponential : bool, optional
            Тип тренда.
        damped_trend : bool, optional
            Затухание тренда.
        """
        self.settings = {
            "initialization_method": initialization_method,
            "initial_level": initial_level,
            "initial_trend": initial_trend,
            "trend": trend,
            "seasonal": seasonal, 
            "seasonal_periods": seasonal_periods,
            "damped_trend": damped_trend
        }
        self.model = None

    def fit(self, data: dict):
        """Обучение модели ExponentialSmoothing на данных.

        Parameters
        ----------
        data : dict
            Словарь с ключом 'endog' - одномерный массив данных временного ряда.

        Returns
        -------
        ExponentialSmoothing
            Обученная модель.
        """
        self.model = ExponentialSmoothing(**data, **self.settings)
        self.model = self.model.fit()
        return self.model

    def forecast(self, steps: int = 1):
        """Прогнозирование значений на заданное количество шагов вперёд.

        Parameters
        ----------
        steps : int, optional
            Количество шагов для прогноза (по умолчанию 1).

        Returns
        -------
        array
            Массив прогнозируемых значений.
        """
        return self.model.forecast(steps=steps)
