🚀 DevBoard — Developer Project & Task Management Dashboard


A full-stack productivity app for developers to manage projects, track tasks, and monitor time — built with React and Node.js.




📌 Overview

DevBoard is a full-stack developer dashboard that helps you organize projects, manage tasks with status tracking, and measure time spent on each task — all in one clean UI.

Built as a personal productivity tool to demonstrate end-to-end full-stack development skills including REST API design, OAuth 2.0 authentication, PostgreSQL data modeling, and React SPA architecture.


📸 Screenshots

LoginDashboard

<img width="1463" height="831" alt="image" src="https://github.com/user-attachments/assets/0bff2dd9-57d4-40cd-ace9-161cbae82949" />
<img width="1466" height="830" alt="image" src="https://github.com/user-attachments/assets/a191499c-d010-47c5-94ac-e18bb7abd88a" />
Task TrackerAnalytics

<img width="1464" height="828" alt="image" src="https://github.com/user-attachments/assets/e84834a7-bfe9-4940-af65-0b286f20d318" />
<img width="1420" height="804" alt="image" src="https://github.com/user-attachments/assets/8f4a4466-e72b-4274-8d37-d505ce48ec3c" />

✨ Features


🔐 Google Sign-In (OAuth 2.0) — Secure authentication via Google Identity Services; no passwords stored
📁 Project Management — Create, view, and delete projects tied to your account
✅ Task Tracking — Add tasks to projects with todo, in-progress, and done status
⏱️ Built-in Time Tracker — Start/stop timer per task; logs duration to the database
📊 Analytics Dashboard — Visualize time spent across tasks and projects
🔒 Protected Routes — All API endpoints secured with JWT middleware
🌐 Deployed on Vercel + Render — Frontend live at devboard-azure.vercel.app



🔑 Authentication Flow

DevBoard uses Google Identity Services for sign-in instead of a traditional email/password system:


User clicks Sign in with Google on the frontend.
Google returns a signed ID token to the browser.
The frontend sends this token to the backend (POST /auth/google).
The backend verifies the token's authenticity directly with Google (google-auth-library).
If valid, the backend looks up the user by google_id (or links/creates the account by email), then issues its own JWT for subsequent API requests.
The frontend stores this JWT and attaches it as a Bearer token on all authenticated requests.


This avoids storing or handling passwords entirely, while keeping the rest of the app's session/authorization model (JWT + middleware) unchanged.


🛠️ Tech Stack

Frontend

TechnologyPurposeReact 19UI frameworkReact Router v7Client-side routing@react-oauth/googleGoogle Identity Services integrationAxiosHTTP requestsViteBuild tool & dev server

Backend

TechnologyPurposeNode.js + Express 5REST API serverPostgreSQL (Neon)Relational databasegoogle-auth-libraryVerifies Google ID tokensJWT (jsonwebtoken)App session tokensdotenvEnvironment configCORSCross-origin handling


🗂️ Project Structure

devboard/
├── backend/
│   ├── routes/
│   │   ├── auth.js        # Google Sign-In verification & JWT issuance
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
        │   ├── Login.jsx          # Google Sign-In button
        │   ├── Dashboard.jsx      # Project list & creation
        │   ├── ProjectPage.jsx    # Tasks + timer per project
        │   └── Analytics.jsx      # Time analytics view
        ├── api/
        │   └── axios.js           # Axios instance with auth headers
        ├── main.jsx                # Wraps app in GoogleOAuthProvider
        └── App.jsx                 # Routes & protected route logic


🗄️ Database Schema

sqlusers         → id, name, email, google_id, avatar_url, created_at
projects      → id, title, description, user_id (FK), created_at
tasks         → id, title, description, status, project_id (FK), timer_started_at, created_at
time_logs     → id, task_id (FK), start_time, end_time, duration


🚀 Getting Started

Prerequisites


Node.js v18+
PostgreSQL database (e.g. Neon)
A Google OAuth 2.0 Client ID (console.cloud.google.com)


1. Clone the Repository

bashgit clone https://github.com/JAYAPRAKASHGUJJARI/devboard.git
cd devboard

2. Backend Setup

bashcd backend
npm install

Create a .env file in backend/:

DATABASE_URL=your-postgres-connection-string
JWT_SECRET=your-random-secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

Initialize the database tables:

bashnode schema.js

Start the backend server:

bashnode index.js

3. Frontend Setup

bashcd frontend
npm install

Create a .env file in frontend/:

VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_URL=http://localhost:8080

Start the dev server:

bashnpm run dev

The app will be running at http://localhost:5173


Note: Your Google OAuth Client's Authorized JavaScript origins must include both http://localhost:5173 (local dev) and your deployed frontend URL (production).




🔌 API Endpoints

MethodEndpointDescriptionAuthPOST/auth/googleVerify Google ID token, create/find user, return JWT❌GET/projectsGet all user projects✅POST/projectsCreate a new project✅DELETE/projects/:idDelete a project✅GET/tasks/:projectIdGet tasks for a project✅POST/tasksCreate a new task✅PATCH/tasks/:id/statusUpdate task status✅DELETE/tasks/:idDelete a task✅POST/timer/:taskId/startStart task timer✅POST/timer/:taskId/stopStop task timer✅GET/timer/:taskIdGet total time for a task✅


🌐 Deployment


Frontend — Deployed on Vercel with SPA routing via vercel.json
Backend — Deployed on Render
Database — PostgreSQL hosted on Neon


Live app: devboard-azure.vercel.app


👤 Author

Jayaprakash Gujjari


GitHub: @JAYAPRAKASHGUJJARI
