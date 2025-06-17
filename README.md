# Predictify

## Сборка и запуск проекта
### Предварительные требования
Для сборки и запуска проекта в вашей системе должны быть установлены [Git](https://git-scm.com/downloads) и [Docker](https://docs.docker.com/desktop/).

### Development-mode
В Development-режиме веб-серверы фронта и бэка автоматически перезапускаются при изменениях в исходном коде, для сборки и запуска проекта в этом режиме необходимо выполнить следующие шаги:
1) Загрузите репозиторий с исходным кодом:
    ```bash
    mkdir Projects
    cd Projects
    git clone https://github.com/gbaka/Predictify.git
    ```
2) Перейдите в корень проекта:
    ```bash
    cd Predictify
    ```
3) Запустите docker-compose, указав конфигурационный файл для режима разработки:
    ```bash
    docker-compose -f docker-compose.dev.yml up
    ```
   После этого докер соберет нужные образы и запустит контейнеры.
   - Веб-сервер фронтенда: http://127.0.0.1:3030 (Vite dev-server)
   - Веб-сервер бэкенда: http://0.0.0.0:8000 (Uvicorn)
   - Сервер БД: postgresql:5432
   
   Остановить все сервисы (фронт, бэк и БД) можно следующей командой:
   ```bash
   docker-compose -f docker-compose.dev.yml stop
   ```

### Production-mode
1) Аналогично Development-режиму
2) Аналогично Development-режиму
3) Запустите docker-compose:
    ```bash
    docker-compose up
    ```
   После этого докер соберет нужные образы и запустит контейнеры.
   - Веб-сервер фронтенда: http://127.0.0.1:8080 (Nginx)
   - Веб-сервер бэкенда: http://0.0.0.0:8000 (Gunicorn)
   - Сервер БД: postgresql:5432
   
   Остановить все сервисы (фронт, бэк и БД) можно следующей командой:
   ```bash
   docker-compose stop
   ```
