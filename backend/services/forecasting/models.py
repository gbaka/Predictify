"""
Модели прогнозирования временных рядов.

Обертки моделей SARIMAX и экспоненциального сглаживания из библиотеки statsmodels.
"""

from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.holtwinters import SimpleExpSmoothing, Holt, ExponentialSmoothing


class SARIMAXModel:
    """
    Модель SARIMAX для прогнозирования временных рядов.

    Параметры модели задаются через конструктор (order, seasonal_order, тренд и др.).

    Methods
    -------
    fit(data)
        Обучение модели на данных.
    forecast(steps)
        Прогнозирование на заданное число шагов.
    detailed_forecast(steps)
        Прогноз с доверительными интервалами.
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
        """
        Parameters
        ----------
        p : int, optional
            Порядок авторегрессии (AR) несезонной части модели.
        d : int, optional
            Степень дифференцирования (I) несезонной части.
        q : int, optional
            Порядок скользящего среднего (MA) несезонной части.
        P : int, optional
            Сезонный порядок авторегрессии.
        D : int, optional
            Сезонная степень дифференцирования.
        Q : int, optional
            Сезонный порядок скользящего среднего.
        s : int, optional
            Количество периодов в сезоне.
        trend : str, optional
            Тип трендовой компоненты ('n', 'c', 't', 'ct').
        enforce_stationarity : bool, optional
            Принудительное соблюдение стационарности модели.
        enforce_invertibility : bool, optional
            Принудительное соблюдение обратимости модели.
        """
        self.settings = {
            "order": (p, d, q),
            "seasonal_order": (P, D, Q, s),
            "trend": trend,
            "enforce_stationarity": enforce_stationarity,
            "enforce_invertibility": enforce_invertibility,
        }
        self.model = None

    def fit(self, data: dict):
        """
        Parameters
        ----------
        data : dict
            Данные временного ряда для обучения.

        Returns
        -------
        SARIMAXResultsWrapper
            Обученная модель.
        """
        self.model = SARIMAX(**data, **self.settings)
        self.model = self.model.fit()
        return self.model

    def forecast(self, steps: int):
        """
        Parameters
        ----------
        steps : int
            Количество шагов для прогноза.

        Returns
        -------
        ndarray
            Прогнозируемые значения.
        """
        return self.model.forecast(steps=steps)

    def detailed_forecast(self, steps: int): 
        """
        Parameters
        ----------
        steps : int
            Количество шагов для прогноза.

        Returns
        -------
        PredictionResults
            Результаты прогноза с доверительными интервалами.
        """
        return self.model.get_forecast(steps=steps)


class ExponentialSmoothingModel:
    """
    Модель тройного экспоненциального сглаживания Холта-Винтерса.

    Параметры инициализируются в конструкторе (инициализация, тренд, сезонность и др.).

    Methods
    -------
    fit(data)
        Обучение модели.
    forecast(steps)
        Прогнозирование.
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
        """
        Parameters
        ----------
        data : dict
            Данные временного ряда для обучения.

        Returns
        -------
        ExponentialSmoothingResultsWrapper
            Обученная модель.
        """
        self.model = ExponentialSmoothing(**data, **self.settings)
        self.model = self.model.fit()
        return self.model

    def forecast(self, steps: int = 1):
        """
        Parameters
        ----------
        steps : int, optional
            Количество шагов для прогноза (по умолчанию 1).

        Returns
        -------
        ndarray
            Прогнозируемые значения.
        """
        return self.model.forecast(steps=steps)
