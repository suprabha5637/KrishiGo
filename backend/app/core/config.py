import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "KrishiGo"
    APP_ENV: str = "development"
    DEBUG: bool = True
    DEMO_MODE: bool = True

    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ]

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite+aiosqlite:///./krishigo.db"
    )

    JWT_SECRET: str = os.getenv("JWT_SECRET", "krishigo-super-secure-production-jwt-secret-key-2026")
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    WEATHER_API_KEY: str = os.getenv("WEATHER_API_KEY", "")
    GOOGLE_MAPS_BROWSER_KEY: str = os.getenv("GOOGLE_MAPS_BROWSER_KEY", "")
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", os.getenv("GOOGLE_MAPS_BROWSER_KEY", ""))

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
