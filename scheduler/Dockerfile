# Используем бзовый образ Python 3.12
FROM python:3.12-slim
LABEL author="gbaka <geo.m2019@mail.ru>"

# Для данного Dockerfile директорией сборки является корневая директория проекта!


# Директория для сервиса внутри контейнера
WORKDIR /app/scheduler

# Копируем файл с зависимостями
COPY ./scheduler .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

WORKDIR /app

# Копируем необходимые модули с бэка
COPY backend/services ./services
COPY backend/database ./database
COPY backend/logger.py ./logger.py

# Запускаем планировщик
CMD ["python", "./scheduler/main.py"]

