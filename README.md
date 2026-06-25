# 🚀 DevBoard — Developer Project & Task Management Dashboard

> A full-stack productivity app for developers to manage projects, track tasks, and monitor time — built with React and Node.js.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-DevBoard-blue?style=for-the-badge)](https://devboard-azure.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/JAYAPRAKASHGUJJARI/devboard)

---

## 📌 Overview

**DevBoard** is a full-stack developer dashboard that helps you organize projects, manage tasks with status tracking, and measure time spent on each task — all in one clean UI.

Built as a personal productivity tool to demonstrate end-to-end full-stack development skills including REST API design, JWT authentication, PostgreSQL data modeling, and React SPA architecture.

---

## 📸 Screenshots

| Login | Dashboard |
|---|---|
| ![Login Page](./screenshots/login.png) | ![Dashboard](./screenshots/dashboard.png) |

| Task Tracker | Analytics |
|---|---|
| ![Tasks](./screenshots/tasks.png) | ![Analytics](./screenshots/analytics.png) |

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register & login with bcrypt password hashing
- 📁 **Project Management** — Create, view, and delete projects tied to your account
- ✅ **Task Tracking** — Add tasks to projects with `todo`, `in-progress`, and `done` status
- ⏱️ **Built-in Time Tracker** — Start/stop timer per task; logs duration to the database
- 📊 **Analytics Dashboard** — Visualize time spent across tasks and projects
- 🔒 **Protected Routes** — All API endpoints secured with JWT middleware
- 🌐 **Deployed on Vercel** — Frontend live at [devboard-azure.vercel.app](https://devboard-azure.vercel.app)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router v7 | Client-side routing |
| Axios | HTTP requests |
| Vite | Build tool & dev server |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| PostgreSQL | Relational database |
| JWT (jsonwebtoken) | Authentication tokens |
| bcrypt | Password hashing |
| dotenv | Environment config |
| CORS | Cross-origin handling |

---

## 🗂️ Project Structure

```
devboard/
├── backend/
│   ├── routes/
│   │   ├── auth.js        # Register & Login
│   │   ├── projects.js    # Project CRUD
│   │   ├── tasks.js       # Task CRUD + status update
│   │   └── timer.js       # Start/stop timer, time logs
│   ├── middleware/
│   │   └── auth.js        # JWT authentication middleware
│   ├── db.js              # PostgreSQL connection pool
│   ├── schema.js          # Database table creation
│   └── index.js           # Express app entry point
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx     # Project list & creation
        │   ├── ProjectPage.jsx   # Tasks + timer per project
        │   └── Analytics.jsx     # Time analytics view
        ├── api/
        │   └── axios.js          # Axios instance with auth headers
        └── App.jsx               # Routes & protected route logic
```

---

## 🗄️ Database Schema

```sql
users         → id, name, email, password, created_at
projects      → id, title, description, user_id (FK), created_at
tasks         → id, title, description, status, project_id (FK), timer_started_at, created_at
time_logs     → id, task_id (FK), start_time, end_time, duration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database

### 1. Clone the Repository
```bash
git clone https://github.com/JAYAPRAKASHGUJJARI/devboard.git
cd devboard
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Initialize the database tables:
```bash
node schema.js
```

Start the backend server:
```bash
node index.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Create new user account | ❌ |
| POST | `/auth/login` | Login and receive JWT | ❌ |
| GET | `/projects` | Get all user projects | ✅ |
| POST | `/projects` | Create a new project | ✅ |
| DELETE | `/projects/:id` | Delete a project | ✅ |
| GET | `/tasks/:projectId` | Get tasks for a project | ✅ |
| POST | `/tasks` | Create a new task | ✅ |
| PATCH | `/tasks/:id/status` | Update task status | ✅ |
| DELETE | `/tasks/:id` | Delete a task | ✅ |
| POST | `/timer/:taskId/start` | Start task timer | ✅ |
| POST | `/timer/:taskId/stop` | Stop task timer | ✅ |
| GET | `/timer/:taskId` | Get total time for a task | ✅ |

---

## 🌐 Deployment

- **Frontend** — Deployed on [Vercel](https://vercel.com) with SPA routing via `vercel.json`
- **Backend** — Can be deployed on  Render
- **Database** — PostgreSQL hosted on Neon 

---

## 👤 Author

**Jayaprakash Gujjari**
- GitHub: [@JAYAPRAKASHGUJJARI](https://github.com/JAYAPRAKASHGUJJARI)
