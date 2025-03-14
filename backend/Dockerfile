# Используем бзовый образ Python 3.12
FROM python:3.12
LABEL author="gbaka <geo.m2019@mail.ru>"

# Копируем все файлы проекта (кроме тех, что в .dockerignore)
COPY . . 

# Устанавливаем зависимости
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Сервер бэкэнда работает на 8000 порту
EXPOSE 8000

# Запускаем FastAPI с Uvicorn (дебаг-конфигурация)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
