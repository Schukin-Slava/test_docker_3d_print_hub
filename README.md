# PrinterHub MVP (Lab 5 — сервисная/микросервисная архитектура в Docker)

Этот репозиторий — минимальный MVP под требования ЛР5:
- **3 контейнера** (frontend + backend + PostgreSQL) в `docker-compose.yml`
- взаимодействие сервисов: UI → API → БД
- **CI**: сборка/запуск через Docker Compose + интеграционные тесты (Postman/Newman) в GitHub Actions
- (опционально) **CD**: публикация образов в Docker Hub (workflow-шаблон)

## 1) Что внутри

- `backend/` — FastAPI + SQLAlchemy + Alembic
- `frontend/` — React (Vite) + Nginx (proxy `/api/*` → backend)
- `postman/` — коллекция интеграционных тестов и env
- `.github/workflows/ci.yml` — CI (build + compose up + newman)

## 2) Предварительные требования на ПК

- Docker Desktop (запущен, **Engine running**)
- Git
- (не обязательно для запуска через Docker) Python и Node

## 3) Запуск локально через Docker (рекомендуется для ЛР5)

Из корня проекта:

```bash
docker compose up -d --build
```

Открыть:
- Frontend: http://localhost:8080
- Backend Swagger: http://localhost:8000/docs
- Health: http://localhost:8000/health

Остановка:

```bash
docker compose down -v
```

## 4) Интеграционные тесты Postman/Newman

Коллекция лежит в `postman/collection.json`.
Прогон через Docker (без установки Node):

```bash
docker compose up -d --build
docker run --rm --network host -v "$PWD/postman:/etc/newman" postman/newman:alpine run /etc/newman/collection.json -e /etc/newman/env.json
```

## 5) CI (GitHub Actions)

Файл: `.github/workflows/ci.yml`

Что делает:
1) `docker compose up -d --build`
2) ждёт `GET /health`
3) запускает интеграционные тесты через контейнер `postman/newman`
4) `docker compose down -v`

## 6) Повышенная сложность (CD в Docker Hub)

Есть шаблон: `.github/workflows/cd_dockerhub.yml`

Чтобы он работал:
1) Создай репозиторий на Docker Hub
2) В GitHub → Settings → Secrets and variables → Actions добавь:
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN` (лучше access token)
3) Пуш в ветку `main` → workflow соберёт и запушит образы:
   - `<username>/printerhub-backend:latest`
   - `<username>/printerhub-frontend:latest`

## 7) Если Docker не работает на Windows (частый случай)

Признак: `failed to connect to the docker API ... dockerDesktopLinuxEngine`

Что сделать:
1) Запусти **Docker Desktop**
2) Дождись статуса **Running**
3) В PowerShell проверь:
   - `docker version`
   - `docker ps`
4) Если всё равно ошибка — проверь Docker context:
   - `docker context ls`
   - `docker context use desktop-linux`
