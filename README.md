# PrinterHub MVP (Lab 5 — сервисная/микросервисная архитектура в Docker)

- **3 контейнера** (frontend + backend + PostgreSQL) в `docker-compose.yml`
- взаимодействие сервисов: UI → API → БД
- **CI**: сборка/запуск через Docker Compose + интеграционные тесты (Postman/Newman) в GitHub Actions
- (опционально) **CD**: публикация образов в Docker Hub (workflow-шаблон)

## 1) Что внутри

- `backend/` — FastAPI + SQLAlchemy + Alembic
- `frontend/` — React (Vite) + Nginx (proxy `/api/*` → backend)
- `postman/` — коллекция интеграционных тестов и env
- `.github/workflows/ci.yml` — CI (build + compose up + newman)

## 3) Запуск локально через Docker

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
Прогон через Docker:

```bash
docker compose up -d --build
docker run --rm --network host -v "$PWD/postman:/etc/newman" postman/newman:alpine run /etc/newman/collection.json -e /etc/newman/env.json
```

