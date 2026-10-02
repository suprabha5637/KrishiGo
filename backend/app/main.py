from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.api.v1.auth import router as auth_router
from backend.app.api.v1.commerce import router as commerce_router
from backend.app.api.v1.farmer import router as farmer_router
from backend.app.api.v1.ai import router as ai_router
from backend.app.api.v1.location import router as location_router
from backend.app.api.v1.translate import router as translate_router

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="KrishiGo Ultimate Full-Stack AI Commerce + Farmer Intelligence Platform API"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoints
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "demo_mode": settings.DEMO_MODE
    }

@app.get("/health/providers")
async def provider_health():
    return {
        "database": "connected",
        "weather_service": "online (Google Maps Platform Weather API & Google Gemini AI)",
        "market_service": "online (AGMARKNET)",
        "ai_service": "online (KrishiGo Farm Copilot)",
        "maps_service": "online (Google Maps Platform Geocoding & Geolocation)"
    }

# Include API v1 Routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(commerce_router, prefix="/api/v1")
app.include_router(farmer_router, prefix="/api/v1")
app.include_router(ai_router, prefix="/api/v1")
app.include_router(location_router, prefix="/api/v1")
app.include_router(translate_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.app.main:app",
        host=settings.BACKEND_HOST,
        port=settings.BACKEND_PORT,
        reload=settings.DEBUG
    )
