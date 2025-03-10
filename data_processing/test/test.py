import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA

# Генерируем тестовый временной ряд (с трендом)
np.random.seed(42)
dates = pd.date_range(start="2024-01-01", periods=100, freq="D")
values = np.cumsum(np.random.randn(100) + 0.5)  # Случайный ряд с трендом

# Обучаем ARIMA (p=2, d=1, q=2)
model = ARIMA(values, order=(2, 1, 2))
fitted_model = model.fit()

# Делаем прогноз на 10 шагов вперед
n_steps = 10
forecast_obj = fitted_model.get_forecast(steps=n_steps)
forecast = forecast_obj.predicted_mean
conf_int = forecast_obj.conf_int(alpha=0.05)  # 95% доверительный интервал

# Создаем новые даты для прогноза
forecast_dates = pd.date_range(start=dates[-1] + pd.Timedelta(days=1), periods=n_steps, freq="D")

# Формируем DataFrame с результатами
forecast_results = pd.DataFrame({
    "date": forecast_dates,
    "forecast": forecast,
    "lower_bound": conf_int[:, 0],
    "upper_bound": conf_int[:, 1],
})

# График
plt.figure(figsize=(10, 5))
plt.plot(dates, values, label="Исторические данные", marker="o")
plt.plot(forecast_dates, forecast, label="Прогноз", marker="o", linestyle="dashed", color="red")
plt.fill_between(forecast_dates, conf_int[:, 0], conf_int[:, 1], color='red', alpha=0.2, label="Доверительный интервал (95%)")
plt.legend()
plt.xticks(rotation=45)
plt.title("Прогнозирование с ARIMA")
plt.show()

# Вывод первых строк прогноза
print(forecast_results.head())
