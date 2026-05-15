# Deployment Guide — Render + Vercel

Deploy the **WEB DEPLOYMENT** project using:

| Component | Platform |
|-----------|----------|
| **Frontend** (`frontend/`) | **Vercel** |
| **Backend** (`backend/` — Spring Boot / Java 17) | **Render** (Docker) |
| **Database** (MySQL) | **Railway** |

> Render blueprints no longer support `runtime: java`. This project uses **`runtime: docker`** with `backend/Dockerfile`.

---

## Architecture

```
[Browser]
    │
    ├──► Vercel  ──►  frontend/*.html, js/config.js
    │
    └──► Render  ──►  Spring Boot REST API  (/api/*)
              │
              └──► Railway MySQL
```

---

## Prerequisites

1. [GitHub](https://github.com) — host this repo  
2. [Railway](https://railway.app) — MySQL only  
3. [Render](https://render.com) — backend (Docker)  
4. [Vercel](https://vercel.com) — frontend  
5. Java 17+ and Maven (local testing)

---

## Step 0 — Push project to GitHub

```powershell
cd "C:\Users\Administrator\Downloads\SEM 8 CP PROJECT\WEB DEPLOYMENT"
git add .
git commit -m "Add Docker Render + Vercel deployment"
git push
```

---

## Step 1 — MySQL on Railway

1. [Railway](https://railway.app) → **New Project** → **Provision MySQL**.
2. Open MySQL → **Variables** / **Connect** and copy host, port, user, password, database.
3. Build the JDBC URL:

   ```text
   jdbc:mysql://HOST:PORT/DATABASE?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
   ```

   Example:

   ```text
   jdbc:mysql://containers-us-west-123.railway.app:6543/railway?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
   ```

---

## Step 2 — Backend on Render (Docker)

### Option A — Blueprint (recommended)

1. [Render Dashboard](https://dashboard.render.com) → **Blueprints** → **New Blueprint Instance**.
2. Connect GitHub and select this repository.
3. Render reads `render.yaml` and creates `recruitment-backend` with **Docker** runtime.
4. When prompted, set environment variables:

   | Key | Value |
   |-----|-------|
   | `SPRING_DATASOURCE_URL` | JDBC URL from Step 1 |
   | `SPRING_DATASOURCE_USERNAME` | Railway MySQL user |
   | `SPRING_DATASOURCE_PASSWORD` | Railway MySQL password |
   | `FRONTEND_URL` | `https://your-app.vercel.app` (set after Step 3) |
   | `APP_MAIL_ENABLED` | `false` |

5. Click **Apply**. Render builds using `backend/Dockerfile` (Maven build inside Docker).
6. Copy your backend URL when live:

   ```text
   https://recruitment-backend-xxxx.onrender.com
   ```

### Option B — Manual Web Service

1. **New +** → **Web Service** → connect GitHub repo.
2. Configure:

   | Setting | Value |
   |---------|-------|
   | **Name** | `recruitment-backend` |
   | **Language / Runtime** | **Docker** |
   | **Dockerfile Path** | `backend/Dockerfile` |
   | **Docker Context** | `backend` |
   | **Plan** | Free |

3. Add the same environment variables as Option A.
4. **Create Web Service**.

### Dockerfile (already in repo)

```dockerfile
# backend/Dockerfile — multi-stage build
FROM maven:3.9-eclipse-temurin-17 AS build
# ... builds recruitment-system-0.0.1-SNAPSHOT.jar
FROM eclipse-temurin:17-jre-alpine
# ... runs with --spring.profiles.active=prod
```

Render injects `PORT`; `application-prod.properties` uses `server.port=${PORT:8080}`.

---

## Step 3 — Frontend on Vercel

1. [Vercel](https://vercel.com) → **Add New** → **Project** → import GitHub repo.
2. Configure:

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | Other |
   | **Root Directory** | `frontend` |
   | **Build Command** | *(empty — static site)* |
   | **Output Directory** | `.` |

   `frontend/vercel.json` is already configured.

3. **Deploy**. Copy your URL:

   ```text
   https://adite-recruitment-frontend.vercel.app
   ```

---

## Step 4 — Connect frontend and backend

1. **Render** → `recruitment-backend` → **Environment** → set:

   ```text
   FRONTEND_URL=https://adite-recruitment-frontend.vercel.app
   ```

   No trailing slash. **Manual Deploy** or wait for auto-redeploy.

2. Edit `frontend/js/config.js`:

   ```javascript
   window.API_CONFIG = {
       baseUrl: "https://recruitment-backend-xxxx.onrender.com/api"
   };
   ```

3. Commit and push (Vercel redeploys):

   ```powershell
   git add frontend/js/config.js
   git commit -m "Set production API URL"
   git push
   ```

---

## Step 5 — Email (optional)

On Render → **Environment**:

| Key | Example |
|-----|---------|
| `APP_MAIL_ENABLED` | `true` |
| `SPRING_MAIL_HOST` | `smtp.gmail.com` |
| `SPRING_MAIL_PORT` | `587` |
| `SPRING_MAIL_USERNAME` | your email |
| `SPRING_MAIL_PASSWORD` | Gmail app password |

---

## Step 6 — Test live app

1. Open your Vercel URL.
2. Log in with demo credentials (see README).
3. **F12** → **Network** — requests should go to `*.onrender.com/api` with `200` responses.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blueprint: `invalid runtime java` | Use this repo’s `render.yaml` with `runtime: docker` (not `java`) |
| Docker build fails | Check Render logs; ensure `pom.xml` and `src/` are under `backend/` |
| CORS error | `FRONTEND_URL` must exactly match Vercel URL (https, no trailing `/`) |
| DB connection failed | Verify JDBC URL and Railway credentials |
| Slow first request | Render free tier sleeps after ~15 min idle; first hit may take 30–60 s |
| Wrong API URL | Update `config.js`, push, hard-refresh (Ctrl+F5) |

---

## Project files reference

| File | Purpose |
|------|---------|
| `backend/Dockerfile` | Multi-stage Java 17 build for Render |
| `render.yaml` | Render blueprint (`runtime: docker`) |
| `frontend/vercel.json` | Vercel static site config |
| `frontend/js/config.js` | Production API base URL |
| `backend/src/main/resources/application-prod.properties` | DB, CORS, mail from env vars |

---

## Deployment order

1. GitHub  
2. Railway MySQL  
3. Render backend (Docker blueprint or manual)  
4. Vercel frontend  
5. Set `FRONTEND_URL` on Render + `config.js` on frontend  
6. Test login and HR dashboard
