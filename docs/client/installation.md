# KrishiGo — Client Installation Guide

## Quick Overview

This guide is designed for clients and IT administrators setting up KrishiGo on a fresh server or local machine.

---

## Step 1: Clone Repository
```bash
git clone https://github.com/suprabha5637/KrishiGo.git
cd KrishiGo
```

---

## Step 2: Configure Environment Variables

1. Copy the sample environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in any text editor.
3. Fill in your credentials:
   - `GOOGLE_MAPS_API_KEY`: Your Google Cloud Console API key (with Maps JS, Places, and Geocoding enabled).
   - `GEMINI_API_KEY`: Your Google AI Studio API key.
   - `SECRET_KEY`: A secure random password for signing user tokens.

---

## Step 3: Run the Automated Start

### Option A: Using Standard Package Managers

Terminal 1 (Backend):
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

Terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run dev
```

### Option B: Accessing the Application
Once both services are running:
- Open your browser to `http://localhost:3000` for the consumer marketplace.
- Open `http://localhost:3000/farmer` for the farmer dashboard.
- Open `http://localhost:8000/docs` to test backend APIs interactively.
