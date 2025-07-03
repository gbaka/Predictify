
# DEPLOY.md

## Целевая среда

* Операционная система: **Ubuntu 22.04 LTS**
* Необходим доступ по SSH
* Деплой осуществляется через GitHub Actions с использованием SSH-ключей

## Шаги по подготовке окружения

### 1. Установка Docker Engine
Для возможности запуска докер-контейнеров установите Docker Engine и сопутствующие компоненты:

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install the Docker packages:
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

---

### 2. Создание пользователя `predictify` и настройка доступа

Создайте отдельного пользователя для выполнения деплоя, выдайте ему root-права и права на использование Docker:

```bash
sudo adduser predictify
sudo usermod -aG sudo predictify
sudo usermod -aG docker predictify
```
Сгенерируйте пару SSH ключей. Приватный SSH-ключ должен лежать в Github Secrets вместе с прочими параметрами подключения в удаленному хосту, публичный SSH-ключ запишите в файл authorized_keys:

```bash
sudo mkdir -p /home/predictify/.ssh
sudo nano /home/predictify/.ssh/authorized_keys
sudo chown -R predictify:predictify /home/predictify/.ssh
sudo chmod 700 /home/predictify/.ssh
sudo chmod 600 /home/predictify/.ssh/authorized_keys
```

---

### 3. Установка и настройка Nginx

Устанавите Nginx — он будет выполнять роль реверс-прокси, перенаправляя трафик на Docker-контейнер фронтенда.

```bash
sudo apt install nginx -y
```

Создайте конфигурационный файл Nginx:

```bash
sudo nano /etc/nginx/sites-available/predictify
```

Пример содержимого:

```
server {
    listen 80;
    server_name <yourdomain.ru> <www.yourdomain.ru>;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активируйте конфигурацию и перезапустите Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/predictify /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### 4. Установка Certbot и настройка SSL-сертификата
Установите Certbot для автоматической настройки SSL-сертификатов от Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d <yourdomain.ru> -d <www.yourdomain.ru>
```

После выполнения команды Certbot автоматически настроит HTTPS и внесёт изменения в конфигурацию Nginx.



## Результат

После выполнения всех вышеуказанных шагов:

* Машина готова к автоматическому деплою с использованием GitHub Actions.
* Приложение будет доступно по HTTPS через доменное имя.
* Используется реверс-прокси на базе Nginx с поддержкой SSL.
