# === Этап 1: Сборка фронта ===
FROM node:20 as builder

# Директория для сервиса внутри контейнера
WORKDIR /app

# Копируем только package.json и package-lock.json (для оптимизации кэширования слоев Docker)
COPY package*.json ./

# Устанавливаем только зависимости
RUN npm ci

# Копируем все файлы проекта (кроме тех, что в .dockerignore)
COPY . .

# Собираем проект (результат в /app/dist)
RUN npm run build      


# === Этап 2: Nginx для статики ===
FROM nginx:1.28.0-alpine

# Копируем конфиг Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Удаляем дефолтный конфиг
RUN rm /etc/nginx/conf.d/default.conf

# Копируем собранные файлы из builder в Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx по умолчанию слушает 80 порт
EXPOSE 80
