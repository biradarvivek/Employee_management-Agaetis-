# Employee Directory

A basic full-stack employee directory with a React + TypeScript + Vite frontend, Tailwind CSS styling, Axios API calls, an Express + TypeScript backend, and MySQL storage.

## Features

- List employees from the database
- Add, edit, and delete employee records
- Search employee names
- Form validation, loading states, API error messages, and delete confirmation
- Responsive layout for desktop and mobile

## Requirements

- Node.js 18 or newer
- MySQL 8 (or a compatible MySQL server)

## 1. Configure the database

Run `backend/schema.sql` in MySQL to create the `employee_directory` database and `employees` table.

In the `backend` folder, copy `.env.example` to `.env` and update `DB_USER` and `DB_PASSWORD` to match your local MySQL setup. Keep `.env` private and do not commit it.

## 2. Start the backend

Open a terminal:

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000` by default. Its endpoints are:

- `GET /employees`
- `POST /employees`
- `PUT /employees/:id`
- `DELETE /employees/:id`

## 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env` (the default API URL is already set to `http://localhost:5000`), then run:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Notes

- Start the backend and make sure MySQL is running before using the app.
- The frontend's `VITE_API_URL` is the backend base URL only; do not append `/employees`.
- For submission, commit source code and lockfiles, but not `.env`, `node_modules`, or build output.
