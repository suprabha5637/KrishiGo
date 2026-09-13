from typing import TypeVar, Generic, Type, Optional, List, Any, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from sqlalchemy.orm import selectinload
from sqlalchemy.sql.expression import Select

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType")
UpdateSchemaType = TypeVar("UpdateSchemaType")

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get_by_id(self, db: AsyncSession, id: Any) -> Optional[ModelType]:
        result = await db.execute(select(self.model).filter(self.model.id == id))
        return result.scalars().first()

    async def get_all(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[ModelType]:
        result = await db.execute(select(self.model).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def create(self, db: AsyncSession, *, obj_in: Dict[str, Any]) -> ModelType:
        db_obj = self.model(**obj_in)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, *, db_obj: ModelType, obj_in: Dict[str, Any]) -> ModelType:
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: Any) -> Optional[ModelType]:
        obj = await self.get_by_id(db=db, id=id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj

    async def soft_delete(self, db: AsyncSession, *, id: Any) -> Optional[ModelType]:
        obj = await self.get_by_id(db=db, id=id)
        if obj and hasattr(obj, "is_active"):
            setattr(obj, "is_active", False)
            db.add(obj)
            await db.commit()
            await db.refresh(obj)
        return obj
