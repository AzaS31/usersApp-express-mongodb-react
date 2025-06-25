# User Management App

 Pet-проект с авторизацией и CRUD-операциями пользователей, реализованный на **Express**, **MongoDB**, **React** и **Vite**, с поддержкой **Docker** и документацией через **Swagger**.

---

## 🚀 Возможности

- Регистрация и авторизация с JWT
- CRUD-операции с пользователями
- Валидация с помощью Joi
- Swagger-документация по API
- Поддержка Docker (frontend + backend + MongoDB)
- E2E-тесты с Jest и Supertest
- UI на React + MUI

---

## 📁 Структура проекта

```
Users_Express_MongoDB/
├── backend/
│   ├── routes/            # Роуты API (auth, users)
│   ├── middlewares/       # Обработка ошибок, авторизация
│   ├── validation/        # Joi-схемы и валидаторы
│   ├── database/          # Подключение к MongoDB
│   ├── logs/              # Winston логгер
│   ├── tests/             # E2E тесты
│   ├── .env               # Переменные окружения
│   ├── Dockerfile         # Dockerfile для backend
│   ├── server.js          # Точка входа
│   └── swagger.js         # Swagger спецификация
│
├── frontend/
│   ├── public/            # Публичные ресурсы
│   ├── src/
│   │   ├── pages/         # Страницы (Login, Register, Users и т.д.)
│   │   ├── components/    # Header, Footer и др.
│   │   └── main.jsx       # Точка входа
│   ├── Dockerfile         # Dockerfile для frontend (сборка + Nginx)
│   ├── nginx.conf         # Конфигурация Nginx
│   └── vite.config.js     # Конфигурация Vite
│
├── docker-compose.yml     # Docker Compose для запуска всех сервисов
└── README.md              # Документация проекта
```

---

## ⚙️ Установка (локально, без Docker)

1. Клонируй репозиторий:

```bash
git clone https://github.com/your-username/Users_Express_MongoDB.git
cd Users_Express_MongoDB
```

2. Установи зависимости и запусти MongoDB (например, локально или в Docker отдельно)

```bash
cd backend
npm install
cp .env.example .env  # создай файл с переменными окружения
npm start
```

3. Запусти фронтенд:

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🐳 Docker

Если хочешь запустить всё через Docker:

```bash
docker-compose up --build
```

- Backend: http://localhost:3000
- Frontend: http://localhost:8080
- Swagger: http://localhost:3000/api-docs

> Убедись, что порт 27017 не занят другим MongoDB-сервером.

---

## 🧪 Тесты

Запуск e2e-тестов (из папки `backend`):

```bash
npm test
```

---

## 📚 Swagger

API-документация доступна по адресу:

```
http://localhost:3000/api-docs
```

---

## 🛠️ Используемые технологии

- **Backend:** Express, MongoDB, Joi, JWT, Winston, Swagger
- **Frontend:** React, Vite, MUI, Axios
- **Тесты:** Jest, Supertest
- **DevOps:** Docker, Docker Compose, Nginx

---

## 📃 Лицензия

MIT