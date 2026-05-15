# Internal Job Application Tracking & Recruitment Management System

**Adite Technologies LLP** — Final Year Internship Project (IA-3 Deployment Ready)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, JavaScript (deployed on **Vercel**) |
| Backend | Spring Boot REST API (deployed on **Render** via Docker) |
| Database | **PostgreSQL** on Render / H2 locally |
| Notifications | In-app message box on dashboards |

## Project Structure

```
WEB DEPLOYMENT/
├── frontend/          → Deploy on Vercel
├── backend/           → Spring Boot API
├── Dockerfile         → Render Docker build
├── render.yaml        → Render API + PostgreSQL blueprint
├── DEPLOYMENT.md      → Step-by-step deploy guide
└── README.md
```

## Quick Start (Local)

```bash
cd backend
mvn spring-boot:run
```

- Backend: http://localhost:8080 (H2 in-memory)

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| HR | hr@adite.com | hr123 |
| Candidate | candidate@adite.com | candidate123 |
| Interviewer | interviewer@adite.com | interviewer123 |

## Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** — Render (Docker + Postgres) + Vercel.

## API Base URL (Production)

Update `frontend/js/config.js`:

```javascript
window.API_CONFIG = {
    baseUrl: "https://your-backend-name.onrender.com/api"
};
```
