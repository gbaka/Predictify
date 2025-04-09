FROM postgres:13

# Копируем SQL-скрипт для создания таблиц (выполнится при первом запуске)
COPY init.sql /docker-entrypoint-initdb.d/

