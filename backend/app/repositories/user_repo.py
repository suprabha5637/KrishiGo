from typing import Optional, List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.repositories.base import BaseRepository
from app.models.user import User, Address

class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(select(User).filter(User.email == email))
        return result.scalars().first()

    async def get_by_phone(self, db: AsyncSession, phone: str) -> Optional[User]:
        result = await db.execute(select(User).filter(User.phone == phone))
        return result.scalars().first()
