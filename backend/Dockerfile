# Используем бзовый образ Python 3.12
FROM python:3.12-slim
LABEL author="gbaka <geo.m2019@mail.ru>"

# Директория для сервиса внутри контейнера
WORKDIR /app

# Копируем все файлы проекта (кроме тех, что в .dockerignore)
COPY . . 

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Сервер бэкэнда работает на 8000 порту
EXPOSE 8000

# Production-запуск с 4-мя воркерами
CMD ["gunicorn", "main:app", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "4", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--timeout", "120", \
     "--preload"]
