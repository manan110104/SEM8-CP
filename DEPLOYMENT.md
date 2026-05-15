# Deployment Guide — Render + Vercel

| Component | Platform |
|-----------|----------|
| **Frontend** | **Vercel** (`frontend/`) |
| **Backend** | **Render** (Docker) |
| **Database** | **Render PostgreSQL** (auto-linked in `render.yaml`) |

> **Do not use Railway MySQL with Render** unless you enjoy connection errors. This project uses **Render Postgres** on the same network as the API.

---

## Architecture

```
Browser → Vercel (frontend) → Render API (Docker) → Render PostgreSQL
```

---

## Prerequisites

- GitHub account with this repo pushed
- [Render](https://render.com) account
- [Vercel](https://vercel.com) account

---

## Step 0 — Push to GitHub

```powershell
cd "C:\Users\Administrator\Downloads\SEM 8 CP PROJECT\WEB DEPLOYMENT"
git add .
git commit -m "Render Postgres + deploy fixes"
git push
```

---

## Step 1 — Deploy backend (Render Blueprint)

1. [Render Dashboard](https://dashboard.render.com) → **Blueprints** → **New Blueprint Instance**.
2. Connect GitHub → select this repository → branch `main`.
3. Render creates:
   - **recruitment-db** (PostgreSQL)
   - **recruitment-backend** (Docker web service)
4. When prompted, set only:

   | Key | Value |
   |-----|-------|
   | `FRONTEND_URL` | `https://your-app.vercel.app` (set after Step 2, or update later) |

   `DATABASE_URL`, `DB_USERNAME`, and `DB_PASSWORD` are filled automatically from the database.

5. Click **Apply** and wait for **Live** status (first build ~5–10 min).

6. Copy backend URL:

   ```text
   https://recruitment-backend-xxxx.onrender.com
   ```

7. Test: open `https://recruitment-backend-xxxx.onrender.com/health` — should return `{"status":"ok"}`.

### If you already have an old Render service (MySQL env vars)

Delete the old web service and database, then run the blueprint again **or**:

1. **New** → **PostgreSQL** → name `recruitment-db`
2. Web service → **Environment** → add:
   - `DATABASE_URL` = Internal Database URL (must be `postgresql://` or `jdbc:postgresql://`)
   - `DB_USERNAME` / `DB_PASSWORD` from Postgres settings
   - Remove old `SPRING_DATASOURCE_*` variables

---

## Step 2 — Deploy frontend (Vercel)

1. [Vercel](https://vercel.com) → **Add New** → **Project** → import GitHub repo.
2. **Root Directory:** `frontend`
3. **Build Command:** empty | **Output:** `.`
4. Deploy and copy URL, e.g. `https://adite-recruitment.vercel.app`

---

## Step 3 — Connect frontend and backend

1. **Render** → `recruitment-backend` → **Environment**:

   ```text
   FRONTEND_URL=https://adite-recruitment.vercel.app
   ```

   Redeploy after saving.

2. Edit `frontend/js/config.js`:

   ```javascript
   window.API_CONFIG = {
       baseUrl: "https://recruitment-backend-xxxx.onrender.com/api"
   };
   ```

3. Commit and push.

---

## Step 4 — Test

1. Open Vercel URL → login: `hr@adite.com` / `hr123`
2. F12 → Network → API calls hit `onrender.com` with status `200`

Demo users are seeded automatically on first start.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `AbstractServiceRegistryImpl` / Hibernate error | DB not reachable — use **Render Postgres** + `DATABASE_URL`, not Railway MySQL |
| `No open ports detected` | App crashed before start — check logs for DB error; confirm `/health` after fix |
| `invalid runtime java` | Use `runtime: docker` in `render.yaml` (already set) |
| `"/src": not found` | Use root `Dockerfile` with `dockerContext: .` |
| CORS error | `FRONTEND_URL` must match Vercel URL exactly (no trailing `/`) |
| Slow first request | Render free tier sleeps; wait 30–60 s on first hit |

---

## Local development

```bash
cd backend
mvn spring-boot:run
```

Uses H2 in-memory (`application.properties`). No Postgres required locally.

---

## Deployment order

1. GitHub push  
2. Render Blueprint (API + Postgres)  
3. Vercel frontend  
4. `FRONTEND_URL` + `config.js`  
5. Test login
