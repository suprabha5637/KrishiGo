from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "KrishiGo API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    APP_ENV: str = "development"
    DEBUG: bool = True
    DEMO_MODE: bool = True
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-for-jwt-token-replace-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/krishigo"
    REDIS_URL: str = "redis://localhost:6379"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
