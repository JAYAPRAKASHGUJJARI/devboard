# 🚀 DevBoard

**Developer Project & Task Management Dashboard**

A full-stack productivity app for developers to manage projects, track tasks, and monitor time — built with React and Node.js.

---

## 📌 Overview

DevBoard helps you organize projects, manage tasks with status tracking, and measure time spent on each task — all in one clean UI.

Built as a personal productivity tool to demonstrate full-stack development skills: REST API design, OAuth 2.0 authentication, PostgreSQL data modeling, and React SPA architecture.

---

## 📸 Screenshots

**Login**

<img width="1463" height="831" alt="Login screen" src="<img width="1463" height="832" alt="image" src="https://github.com/user-attachments/assets/c21de351-1ea1-4463-9c27-c7f5eef6c154" />
" />

**Dashboard**

<img width="1466" height="830" alt="Dashboard screen" src="https://github.com/user-attachments/assets/a191499c-d010-47c5-94ac-e18bb7abd88a" />

**Task Tracker**

<img width="1464" height="828" alt="Task tracker screen" src="https://github.com/user-attachments/assets/e84834a7-bfe9-4940-af65-0b286f20d318" />

**Analytics**

<img width="1420" height="804" alt="Analytics screen" src="https://github.com/user-attachments/assets/8f4a4466-e72b-4274-8d37-d505ce48ec3c" />

---

## ✨ Features

- 🔐 Google Sign-In (OAuth 2.0) — no passwords stored
- 📁 Project management — create, view, delete
- ✅ Task tracking with `todo` / `in-progress` / `done` status
- ⏱️ Built-in time tracker per task
- 📊 Analytics dashboard for time spent
- 🔒 Protected API routes via JWT middleware
- 🌐 Live at **[devboard-azure.vercel.app](https://devboard-azure.vercel.app)**

---

## 🔑 How Authentication Works

1. User clicks **Sign in with Google**
2. Google returns a signed ID token to the browser
3. Frontend sends that token to the backend: `POST /auth/google`
4. Backend verifies the token with Google (`google-auth-library`)
5. Backend finds or creates the user, then issues its own JWT
6. Frontend stores the JWT and sends it as a `Bearer` token on every request after that

No passwords are ever stored — only Google's verified identity.

---

## 🛠️ Tech Stack

**Frontend**

- React 19
- React Router v7
- @react-oauth/google
- Axios
- Vite

**Backend**

- Node.js + Express 5
- PostgreSQL (Neon)
- google-auth-library
- jsonwebtoken
- dotenv
- cors

---

## 🗂️ Project Structure

```
devboard/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── timer.js
│   ├── middleware/
│   │   └── auth.js
│   ├── db.js
│   ├── schema.js
│   └── index.js
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   ├── ProjectPage.jsx
        │   └── Analytics.jsx
        ├── api/
        │   └── axios.js
        ├── main.jsx
        └── App.jsx
```

**Backend files**

| File | Purpose |
|---|---|
| `routes/auth.js` | Verifies Google sign-in, issues JWT |
| `routes/projects.js` | Project CRUD |
| `routes/tasks.js` | Task CRUD + status updates |
| `routes/timer.js` | Start/stop timer, time logs |
| `middleware/auth.js` | Protects routes with JWT check |
| `db.js` | PostgreSQL connection pool |
| `schema.js` | Creates database tables |
| `index.js` | Express app entry point |

**Frontend files**

| File | Purpose |
|---|---|
| `pages/Login.jsx` | Google Sign-In button |
| `pages/Dashboard.jsx` | Project list & creation |
| `pages/ProjectPage.jsx` | Tasks + timer per project |
| `pages/Analytics.jsx` | Time analytics view |
| `api/axios.js` | Axios instance with auth headers |
| `main.jsx` | Wraps app in GoogleOAuthProvider |
| `App.jsx` | Routes & protected route logic |

---

## 🗄️ Database Schema

**users**
`id, name, email, google_id, avatar_url, created_at`

**projects**
`id, title, description, user_id (FK), created_at`

**tasks**
`id, title, description, status, project_id (FK), timer_started_at, created_at`

**time_logs**
`id, task_id (FK), start_time, end_time, duration`

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database (e.g. [Neon](https://neon.tech))
- A Google OAuth Client ID from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### 1. Clone the repo

```bash
git clone https://github.com/JAYAPRAKASHGUJJARI/devboard.git
cd devboard
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```
DATABASE_URL=your-postgres-connection-string
JWT_SECRET=your-random-secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Create the database tables:

```bash
node schema.js
```

Start the server:

```bash
node index.js
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_URL=http://localhost:8080
```

Start the dev server:

```bash
npm run dev
```

App runs at `http://localhost:5173`

> **Note:** In Google Cloud Console, your OAuth Client's Authorized JavaScript origins must include both `http://localhost:5173` and your deployed frontend URL.

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/google` | Verify Google token, return JWT | ❌ |
| GET | `/projects` | Get user's projects | ✅ |
| POST | `/projects` | Create a project | ✅ |
| DELETE | `/projects/:id` | Delete a project | ✅ |
| GET | `/tasks/:projectId` | Get tasks for a project | ✅ |
| POST | `/tasks` | Create a task | ✅ |
| PATCH | `/tasks/:id/status` | Update task status | ✅ |
| DELETE | `/tasks/:id` | Delete a task | ✅ |
| POST | `/timer/:taskId/start` | Start task timer | ✅ |
| POST | `/timer/:taskId/stop` | Stop task timer | ✅ |
| GET | `/timer/:taskId` | Get total time for a task | ✅ |

---

## 🌐 Deployment

| Layer | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [Neon](https://neon.tech) |

Live app: **[devboard-azure.vercel.app](https://devboard-azure.vercel.app)**

---

## 👤 Author

**Jayaprakash Gujjari**
GitHub: [@JAYAPRAKASHGUJJARI](https://github.com/JAYAPRAKASHGUJJARI)
