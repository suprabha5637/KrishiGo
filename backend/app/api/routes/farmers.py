from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.database.session import get_db
from app.core.dependencies import get_current_active_user, require_role
from app.models.user import User, UserRole
from app.schemas.farmer import (
    FarmerCropCreate, FarmerCropUpdate, FarmerCropResponse,
    FarmerEarningResponse, FarmerSettlementResponse
)
from app.services.farmer_service import farmer_service

router = APIRouter()

@router.get("/earnings", response_model=List[FarmerEarningResponse])
async def get_my_earnings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.FARMER))
):
    farmer = await farmer_service.get_farmer_by_user_id(db, current_user.id)
    return await farmer_service.get_earnings(db, farmer.id)

@router.get("/settlements", response_model=List[FarmerSettlementResponse])
async def get_my_settlements(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.FARMER))
):
    farmer = await farmer_service.get_farmer_by_user_id(db, current_user.id)
    return await farmer_service.get_settlements(db, farmer.id)

@router.post("/crops", response_model=FarmerCropResponse, status_code=status.HTTP_201_CREATED)
async def create_crop(
    crop_in: FarmerCropCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.FARMER))
):
    farmer = await farmer_service.get_farmer_by_user_id(db, current_user.id)
    return await farmer_service.create_crop(db, farmer.id, crop_in)

@router.get("/crops", response_model=List[FarmerCropResponse])
async def get_crops(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.FARMER))
):
    farmer = await farmer_service.get_farmer_by_user_id(db, current_user.id)
    return await farmer_service.get_crops(db, farmer.id)

@router.put("/crops/{crop_id}", response_model=FarmerCropResponse)
async def update_crop(
    crop_id: UUID,
    crop_in: FarmerCropUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.FARMER))
):
    farmer = await farmer_service.get_farmer_by_user_id(db, current_user.id)
    return await farmer_service.update_crop(db, farmer.id, crop_id, crop_in)

@router.delete("/crops/{crop_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_crop(
    crop_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.FARMER))
):
    farmer = await farmer_service.get_farmer_by_user_id(db, current_user.id)
    await farmer_service.delete_crop(db, farmer.id, crop_id)
