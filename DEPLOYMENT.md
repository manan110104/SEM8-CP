# Deployment Guide — Adite Recruitment System (IA-3)

**Stack:** HTML/CSS/JS (Vercel) + Spring Boot (Render) + MySQL (Railway)

---

## Final Project Structure

```
WEB DEPLOYMENT/
├── frontend/                 ← Deploy this folder on Vercel
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── candidate-home.html
│   ├── interviewer-home.html
│   ├── hr.html
│   ├── jobs.html
│   ├── interview.html
│   ├── css/styles.css
│   ├── js/
│   │   ├── config.js         ← Set Render backend URL here
│   │   ├── common.js
│   │   └── ...
│   └── vercel.json
├── backend/                  ← Deploy this folder on Render
│   ├── pom.xml
│   └── src/main/
│       ├── java/...
│       └── resources/
│           ├── application.properties      (local H2)
│           └── application-prod.properties   (MySQL + production)
├── render.yaml
└── DEPLOYMENT.md
```

---

## PART 1 — Frontend on Vercel

### Step 1: Update API URL

Edit `frontend/js/config.js`:

```javascript
window.API_CONFIG = {
    baseUrl: "https://YOUR-BACKEND-NAME.onrender.com/api"
};
```

Replace with your actual Render URL after backend deployment.

### Step 2: Push to GitHub

1. Create a GitHub repository.
2. Push the project (or at least the `frontend/` folder as root if using subdirectory deploy).

### Step 3: Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in.
2. **Add New Project** → Import your GitHub repo.
3. **Root Directory:** set to `frontend` (if repo contains full project).
4. Framework Preset: **Other** (static site).
5. Build Command: leave empty.
6. Output Directory: `.` (current folder).
7. Click **Deploy**.

### Step 4: Test frontend

Open your Vercel URL, e.g. `https://your-app.vercel.app`

- Landing page → Login → Register → Role dashboards

---

## PART 2 — Backend on Render

### Step 1: Build JAR locally (optional test)

```bash
cd backend
mvn clean package -DskipTests
java -jar target/recruitment-system-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### Step 2: Create Render Web Service

1. Go to [https://render.com](https://render.com)
2. **New +** → **Web Service**
3. Connect GitHub repository
4. Settings:
   - **Name:** `recruitment-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Java
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/recruitment-system-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod`

### Step 3: Environment variables on Render

| Variable | Example / Description |
|----------|----------------------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `PORT` | (auto-set by Render) |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://host:port/railway` |
| `SPRING_DATASOURCE_USERNAME` | `root` |
| `SPRING_DATASOURCE_PASSWORD` | your password |
| `FRONTEND_URL` | `https://your-app.vercel.app` |
| `APP_MAIL_ENABLED` | `true` or `false` |
| `SPRING_MAIL_HOST` | `smtp.gmail.com` |
| `SPRING_MAIL_PORT` | `587` |
| `SPRING_MAIL_USERNAME` | your email |
| `SPRING_MAIL_PASSWORD` | app password |

---

## PART 3 — MySQL on Railway

### Step 1: Create MySQL database

1. Go to [https://railway.app](https://railway.app)
2. **New Project** → **Provision MySQL**
3. Open MySQL service → **Connect** → copy:
   - Host, Port, Database, User, Password

### Step 2: Build JDBC URL

Format:

```
jdbc:mysql://HOST:PORT/DATABASE
```

Example:

```
jdbc:mysql://containers-us-west-xxx.railway.app:6543/railway
```

### Step 3: Add to Render env vars

```
SPRING_DATASOURCE_URL=jdbc:mysql://...
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=xxxx
```

### How cloud DB works

- Spring Boot JPA creates tables automatically (`ddl-auto=update`).
- Data persists in Railway MySQL (not in-memory).
- Demo users/jobs are seeded on first empty database via `DataInitializer`.

---

## PART 4 — Email Notifications

### When emails are sent

| HR Action | Email to |
|-----------|----------|
| Shortlist | Candidate |
| Reject | Candidate |
| Schedule Interview | Candidate + Interviewer |

### Gmail SMTP setup (example)

1. Enable 2FA on Gmail.
2. Create **App Password**.
3. On Render set:

```
APP_MAIL_ENABLED=true
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your@gmail.com
SPRING_MAIL_PASSWORD=your-app-password
```

If `APP_MAIL_ENABLED=false`, app still works — emails are skipped (logged only).

---

## PART 5 — Connect All Three

1. Deploy **MySQL** (Railway) → get JDBC URL.
2. Deploy **Backend** (Render) → set MySQL + `FRONTEND_URL`.
3. Copy Render URL → update `frontend/js/config.js`.
4. Deploy **Frontend** (Vercel).
5. Update Render `FRONTEND_URL` to exact Vercel URL (for CORS).

### Test flow

1. Register candidate + interviewer on Vercel site.
2. Login as candidate → apply for job.
3. Login as HR → shortlist → schedule interview with interviewer email.
4. Check candidate/interviewer dashboards for messages.
5. Check email inbox if mail enabled.

---

## Local Development

### Backend (H2)

```bash
cd backend
mvn spring-boot:run
```

Open: `http://localhost:8080`

### Frontend (optional separate server)

```bash
cd frontend
python -m http.server 5500
```

Open: `http://localhost:5500`  
(API auto-uses `localhost:8080` when hostname is localhost)

---

## Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| CORS error | Set `FRONTEND_URL` on Render to exact Vercel URL (no trailing slash) |
| API not found | Check `config.js` baseUrl ends with `/api` |
| 502 on Render | Wait for free tier cold start; check build logs |
| MySQL connection fail | Verify JDBC URL, username, password, public networking |
| Interviewer not found | Interviewer must register first with same email |
| Emails not sent | Set `APP_MAIL_ENABLED=true` and SMTP credentials |
| Old UI showing | Hard refresh Ctrl+F5 or redeploy Vercel |
| Blank HR table | Ensure backend is running and DB seeded |

---

## Viva Points (Simple Explanation)

1. **3-tier architecture:** HTML UI → Spring REST API → MySQL database.
2. **Role-based access:** HR, Candidate, Interviewer with separate dashboards.
3. **Recruitment workflow:** Apply → Shortlist/Reject/Select → Schedule Interview.
4. **Notifications:** In-app message box + email alerts.
5. **Cloud deployment:** Vercel (frontend) + Render (backend) + Railway (database).
6. **CORS:** Allows frontend domain to call backend API securely.
7. **Environment variables:** Keep secrets out of source code.

---

## Demo Credentials (auto-seeded)

| Role | Email | Password |
|------|-------|----------|
| HR | hr@adite.com | hr123 |
| Candidate | candidate@adite.com | candidate123 |
| Interviewer | interviewer@adite.com | interviewer123 |

---

**Project:** Internal Job Application Tracking & Recruitment Management System  
**Company:** Adite Technologies LLP  
**Phase:** IA-3 / Week 12–18 — Full Web Deployment
