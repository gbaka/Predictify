-- Создаём таблицы прогнозов в одной транзакции
DO $$
BEGIN
    -- Таблица для хранения прогнозов погоды
    CREATE TABLE IF NOT EXISTS weather_forecast (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP NOT NULL,
        endog FLOAT NOT NULL,
        predict FLOAT,
        ci_low FLOAT,
        ci_up FLOAT,
        created_at TIMESTAMP DEFAULT NOW()
    );
    
    -- Тестовая таблица (аналогичная структура)
    CREATE TABLE IF NOT EXISTS test (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP NOT NULL,
        endog FLOAT NOT NULL,
        predict FLOAT,
        ci_low FLOAT,
        ci_up FLOAT,
        created_at TIMESTAMP DEFAULT NOW()
    );
    
    -- Индексы для обеих таблиц
    CREATE INDEX IF NOT EXISTS idx_weather_forecast_date ON weather_forecast(date);
    CREATE INDEX IF NOT EXISTS idx_test_date ON test(date);
    
    RAISE NOTICE 'Таблицы weather_forecast и test созданы';
END $$;