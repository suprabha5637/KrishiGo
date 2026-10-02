# KrishiGo — Local Development Setup Guide

## System Requirements

- **Node.js**: v20.x or v22.x LTS
- **Python**: 3.11 or 3.12
- **npm**: v10+
- **Git**

---

## 1. Clone & Workspace Setup

```bash
git clone https://github.com/suprabha5637/KrishiGo.git
cd KrishiGo
```

---

## 2. Backend Setup

```bash
# Create Python virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install Python requirements
pip install -r backend/requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and supply your credentials (or run with default demo values)

# Seed database with sample categories, products, and farm data
python database/seeds/seed.py

# Start FastAPI backend server
uvicorn backend.app.main:app --reload --port 8000
```
Backend will be live at: `http://localhost:8000`  
Interactive Swagger API docs: `http://localhost:8000/docs`

---

## 3. Frontend Setup

In a new terminal window:

```bash
cd frontend

# Install npm packages
npm install

# Build verification
npm run build

# Start Vite development server
npm run dev
```
Frontend will be accessible at: `http://localhost:3000` (or `http://localhost:5173`)

---

## 4. Verification Checklist

1. Open `http://localhost:3000/` → Verify header, categories, fresh vegetables, and bottom product grids load.
2. Open `http://localhost:3000/farmer` → Verify farmer command center, weather widget, and map render.
3. Test Cart Drawer → Click **ADD** on any vegetable card → open cart drawer → verify subtotal calculation.
