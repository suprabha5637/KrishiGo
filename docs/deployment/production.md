# KrishiGo — Production Deployment Guide

## Production Architecture

In production, KrishiGo is structured as:
- **Frontend**: Static distribution files (`frontend/dist/`) hosted on **Firebase Hosting** or **Cloudflare Pages / AWS S3 + CloudFront**.
- **Backend**: Containerized FastAPI application on **Google Cloud Run**, **AWS ECS**, or a managed Linux VPS (Ubuntu 22.04 + systemd + Nginx).
- **Database**: Managed **PostgreSQL 16** (Google Cloud SQL or AWS RDS).

---

## 1. Building the Frontend

```bash
cd frontend
npm ci
npm run build
```
This generates the optimized bundle in `frontend/dist/`.

---

## 2. Dockerizing the Backend

Create/Run Docker container:

```dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY database/ ./database/

ENV PYTHONPATH=/app
EXPOSE 8000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

---

## 3. Environment Checklist for Production

Set the following environment variables in your Cloud Run or server environment:

```env
APP_ENV=production
DEBUG=false
SECRET_KEY=<generate_a_64_char_cryptographic_random_string>
DATABASE_URL=postgresql+asyncpg://user:password@db-host:5432/krishigo
BACKEND_CORS_ORIGINS=["https://krishigo.com", "https://farmer.krishigo.com"]
GOOGLE_MAPS_API_KEY=<your_restricted_production_google_key>
GEMINI_API_KEY=<your_production_gemini_key>
FIREBASE_SERVICE_ACCOUNT_PATH=/secrets/service-account.json
```

---

## 4. HTTPS & Domain Routing

Route `/api/*` requests to the Cloud Run backend container and all other paths to the static frontend bundle using Nginx, Cloudflare, or Firebase Hosting rewrites (`firebase.json`).
