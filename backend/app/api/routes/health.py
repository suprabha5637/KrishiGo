from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database.session import get_db

router = APIRouter()

@router.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}

@router.get("/ready", tags=["Health"])
async def ready_check(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "ready", "database": "connected"}
    except Exception as e:
        return {"status": "not_ready", "database": "disconnected", "error": str(e)}
