from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID
from fastapi import HTTPException
from app.models.farmer import FarmerCrop, FarmerEarning, FarmerSettlement, Farmer
from app.schemas.farmer import FarmerCropCreate, FarmerCropUpdate

class FarmerService:
    async def get_farmer_by_user_id(self, db: AsyncSession, user_id: UUID) -> Farmer:
        stmt = select(Farmer).where(Farmer.user_id == user_id)
        result = await db.execute(stmt)
        farmer = result.scalars().first()
        if not farmer:
            raise HTTPException(status_code=404, detail="Farmer profile not found")
        return farmer

    async def get_earnings(self, db: AsyncSession, farmer_id: UUID):
        stmt = select(FarmerEarning).where(FarmerEarning.farmer_id == farmer_id)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def get_settlements(self, db: AsyncSession, farmer_id: UUID):
        stmt = select(FarmerSettlement).where(FarmerSettlement.farmer_id == farmer_id)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def create_crop(self, db: AsyncSession, farmer_id: UUID, crop_in: FarmerCropCreate):
        crop = FarmerCrop(farmer_id=farmer_id, **crop_in.model_dump())
        db.add(crop)
        await db.commit()
        await db.refresh(crop)
        return crop

    async def get_crops(self, db: AsyncSession, farmer_id: UUID):
        stmt = select(FarmerCrop).where(FarmerCrop.farmer_id == farmer_id)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def update_crop(self, db: AsyncSession, farmer_id: UUID, crop_id: UUID, crop_in: FarmerCropUpdate):
        stmt = select(FarmerCrop).where(FarmerCrop.id == crop_id, FarmerCrop.farmer_id == farmer_id)
        result = await db.execute(stmt)
        crop = result.scalars().first()
        if not crop:
            raise HTTPException(status_code=404, detail="Crop not found")
        
        update_data = crop_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(crop, field, value)
            
        await db.commit()
        await db.refresh(crop)
        return crop

    async def delete_crop(self, db: AsyncSession, farmer_id: UUID, crop_id: UUID):
        stmt = select(FarmerCrop).where(FarmerCrop.id == crop_id, FarmerCrop.farmer_id == farmer_id)
        result = await db.execute(stmt)
        crop = result.scalars().first()
        if not crop:
            raise HTTPException(status_code=404, detail="Crop not found")
            
        await db.delete(crop)
        await db.commit()
        return True

farmer_service = FarmerService()
