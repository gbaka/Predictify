# Используем официальный образ с Node.js
FROM node:20
LABEL author="gbaka <geo.m2019@mail.ru>"

# Директория для сервиса внутри контейнера
WORKDIR /app

# Копируем все файлы проекта (кроме тех, что в .dockerignore)
COPY . .

# Устанавливаем зависимости (описаны в package.json)
RUN npm install 

# Собираем проект с помощью Vite
RUN npm run build

# Сервер фронтенда работает на 8080 порту
EXPOSE 8080

# Запускаем сервер, чтобы обслуживать статику
CMD ["npm", "run", "preview"]
