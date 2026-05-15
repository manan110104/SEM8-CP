# Internal Job Application Tracking & Recruitment Management System

**Adite Technologies LLP** — Final Year Internship Project (IA-3 Deployment Ready)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, JavaScript (deployed on **Vercel**) |
| Backend | Spring Boot REST API (deployed on **Render**) |
| Database | MySQL cloud (**Railway**) / H2 for local dev |
| Notifications | In-app message box + Email (JavaMailSender) |

## Project Structure

```
WEB DEPLOYMENT/
├── frontend/          → Deploy on Vercel
├── backend/           → Deploy on Render
├── render.yaml        → Render blueprint
├── DEPLOYMENT.md      → Full step-by-step deployment guide
└── README.md
```

## Features

- Role-based login: **HR**, **Candidate**, **Interviewer**
- Candidate registration, job application, status dashboard
- HR: shortlist, reject, select, schedule interview
- Interviewer dashboard with assigned interviews
- Email notifications on shortlist, reject, interview schedule
- Cloud-ready CORS, MySQL, environment variables

## Quick Start (Local)

```bash
# Backend
cd backend
mvn spring-boot:run

# Frontend (optional separate server)
cd frontend
python -m http.server 5500
```

- Backend: http://localhost:8080
- Frontend: http://localhost:5500

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| HR | hr@adite.com | hr123 |
| Candidate | candidate@adite.com | candidate123 |
| Interviewer | interviewer@adite.com | interviewer123 |

## Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete instructions:

1. Railway MySQL setup
2. Render backend deployment
3. Vercel frontend deployment
4. Email SMTP configuration
5. Testing & troubleshooting

## API Base URL (Production)

Update `frontend/js/config.js`:

```javascript
window.API_CONFIG = {
    baseUrl: "https://your-backend-name.onrender.com/api"
};
```

## REST API Endpoints

- `POST /api/register` — Candidate/Interviewer registration
- `POST /api/login` — Login
- `POST /api/apply` — Submit application
- `GET /api/applications` — HR list applications
- `PUT /api/applications/{id}/status` — Update status
- `POST /api/interviews` — Schedule interview (by interviewer email)
- `GET /api/candidate/home?email=` — Candidate dashboard
- `GET /api/interviews/home?email=` — Interviewer dashboard
