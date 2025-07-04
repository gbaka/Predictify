"""
Модуль для прогнозирования временных рядов.

Содержит функцию `forecast`, которая выбирает модель по переданным параметрам, настраивает её,
обучает на данных и возвращает прогноз с дополнительной информацией.
"""

from typing import Dict

from .models import SARIMAXModel, ExponentialSmoothingModel
from .utils import extend_dates, is_camel_case, camel_to_snake, validate_no_nans
from logger import Logger


logger = Logger(name='forecasting', log_dir='logs', log_file='forecasting.log').get_logger()


def forecast(data: Dict, model_type: str, settings: Dict):
    """
    Выполняет прогнозирование временного ряда выбранной моделью.

    Parameters
    ----------
    data : dict
        Входные данные временного ряда.
    model_type : str
        Тип модели (например, "ARIMA", "HWES").
    settings : dict
        Параметры модели и количество шагов прогноза ('steps').

    Returns
    -------
    dict
        Результат прогноза с ключами:
        - summary: саммари прогноза,
        - full_dates: список даты полного временного ряда (endog + predict),
        - endog: исходные данные,
        - prediction: прогнозные значения,
        - confidence_intervals: интервалы доверия (если применимо).

    Raises
    ------
    ValueError
        При неизвестном типе модели или при наличии NaN в прогнозе.
    """

    nan_found_message = "Обнаружены NaN значения в данных прогноза"
    unknown_model_message = "Неизвестная модель"

    steps = settings.pop("steps")

    logger.info(f"Запуск прогноза: модель={model_type}, шаги={steps}")
    logger.debug(f"Исходные настройки модели: {settings}")

    for param in settings.copy().keys():
        if is_camel_case(param):
            settings[camel_to_snake(param)] = settings.pop(param)

    if model_type in ["SARIMA", "ARIMA", "ARMA", "AR", "MA"]:
        significance_level = settings.pop("significance_level")
        logger.info(
            f"Используется модель {model_type} с уровнем значимости {significance_level}"
        )
        model = SARIMAXModel(**settings)
        summary = model.fit(data).summary().as_text()

        prediction_result = model.detailed_forecast(steps)
        prediction_vals = prediction_result.predicted_mean
        validate_no_nans(prediction_vals, nan_found_message)
        prediction_conf_ints = prediction_result.conf_int(
            alpha=significance_level
        ).tolist()

        full_dates = extend_dates(data, steps)
        logger.info(f"Прогноз по модели {model_type} успешно построен")

        return {
            "summary": summary,
            "full_dates": full_dates,
            "endog": data.get("endog"),
            "prediction": prediction_vals.tolist(),
            "confidence_intervals": {
                "intervals": prediction_conf_ints,
                "confidence_level": round(1 - significance_level, 2),
            },
        }

    elif model_type in ["HWES", "HES", "SES"]:
        logger.info(f"Используется модель сглаживания {model_type}")

        if settings["initialization_method"] != "known":
            settings.pop("initial_level", None)
            settings.pop("initial_trend", None)
        if "exponential" in settings.keys():
            exponential = settings.pop("exponential")
            settings["trend"] = "mul" if exponential else "add"
        if settings.get("trend", None) == "none":
            settings["trend"] = None
        if settings.get("seasonal", None) == "none":
            settings["seasonal"] = None

        model = ExponentialSmoothingModel(**settings)
        full_dates = extend_dates(data, steps)
        summary = model.fit(data).summary().as_text()

        prediction_vals = model.forecast(steps)
        validate_no_nans(prediction_vals, nan_found_message)

        logger.info(f"Прогноз по модели {model_type} успешно построен")

        return {
            "summary": summary,
            "full_dates": full_dates,
            "endog": data.get("endog"),
            "prediction": prediction_vals.tolist(),
            "confidence_intervals": {"intervals": None, "confidence_level": None},
        }

    else:
        logger.error(f"Выбрана неизвестная модель: {model_type}")
        raise ValueError(unknown_model_message)