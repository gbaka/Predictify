#!/usr/bin/env python3

import os
import sys
import pandas as pd
import numpy as np
import itertools
import matplotlib.pyplot as plt
import datetime
import warnings
from tqdm import tqdm
from sklearn.metrics import mean_squared_error
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tools.sm_exceptions import ModelWarning, ValueWarning

# Добавление корня проекта в Path (для того чтобы ресолвились нужные модули)
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from scheduler.config_loader import ConfigLoader
from backend.services.parsers import parse

warnings.simplefilter("ignore", ModelWarning)
warnings.simplefilter("ignore", ValueWarning)
warnings.simplefilter("ignore", UserWarning)
warnings.simplefilter("ignore", RuntimeWarning)

config_loader = ConfigLoader("../scheduler/scheduler_config.yml")
tasks_config = config_loader.tasks

# ПАРАМЕТРЫ:
# Перебор параметров SARIMA
p = d = q = range(0, 3)
P = D = Q = range(0, 3)
seasonal_period = 24
# Кол-во дней до end_date
days_back = 5

for task_config in tasks_config:
    task_name = task_config['name'] 
    print("=" * 60)
    print(f"🔮 Прогнозирование для задачи: {task_name}")
    print("-" * 60)

    print("📥 Парсинг данных...")
    end_date = datetime.datetime.strptime(task_config['parser']['params']['end_date'], "%Y-%m-%d").date()
    start_date = end_date - datetime.timedelta(days=days_back)
    task_config['parser']['params']['start_date'] = start_date.strftime('%Y-%m-%d')
    parsed_data = parse(
        parser_type=task_config['parser']['type'],
        params=task_config['parser']['params']
    )

    print("🧹 Очистка данных...")
    df = pd.DataFrame({
        'date': parsed_data['dates'],
        'value': parsed_data['endog']
    }).dropna()
    df.set_index('date', inplace=True)

    try:
        inferred_freq = pd.infer_freq(df.index)
        df.index = pd.DatetimeIndex(df.index, freq=inferred_freq)
        print(f"⏱ Частота временного ряда определена как: {inferred_freq}")
    except Exception:
        print("⚠️ Не удалось определить частоту временного ряда.")

    # Деление на train/test
    train_size = int(len(df) * 0.8)
    train, test = df.iloc[:train_size], df.iloc[train_size:]
    print(f"📊 Размер train: {len(train)}, test: {len(test)}")

    pdq = list(itertools.product(p, d, q))
    seasonal_pdq = list(itertools.product(P, D, Q))

    results = []

    print(f"⚙️ Начинаем перебор параметров SARIMAX (может занять время)...")
    for param in tqdm(pdq):
        for seasonal in seasonal_pdq:
            try:
                model = SARIMAX(
                    train,
                    order=param,
                    seasonal_order=seasonal + (seasonal_period,),
                    enforce_stationarity=False,
                    enforce_invertibility=False
                )
                model_fit = model.fit(disp=False)
                pred = model_fit.forecast(steps=len(test))
                rmse = np.sqrt(mean_squared_error(test, pred))

                results.append({
                    'order': param,
                    'seasonal_order': seasonal + (seasonal_period,),
                    'rmse': rmse
                })
            except Exception:
                continue

    if not results:
        print("❌ Не удалось подобрать модель. Пропускаем задачу.")
        continue

    results.sort(key=lambda x: x['rmse'])
    top_n = 3

    print("\n🏆 Топ-3 конфигурации по RMSE:")
    print("{:<15} {:<25} {:<10}".format("Order", "Seasonal Order", "RMSE"))
    for r in results[:top_n]:
        print("{:<15} {:<25} {:.4f}".format(
            str(r['order']),
            str(r['seasonal_order']),
            r['rmse']
        ))
    print('\n')
    
