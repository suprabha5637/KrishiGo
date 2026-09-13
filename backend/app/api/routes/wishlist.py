from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.database.session import get_db
from app.schemas.common import ApiResponse

router = APIRouter()

@router.get("", response_model=ApiResponse)
async def get_wishlist(db: AsyncSession = Depends(get_db)):
    return ApiResponse(data=[])

@router.post("", response_model=ApiResponse)
async def add_to_wishlist(db: AsyncSession = Depends(get_db)):
    return ApiResponse(data={})

@router.delete("/{product_id}", response_model=ApiResponse)
async def remove_from_wishlist(product_id: UUID, db: AsyncSession = Depends(get_db)):
    return ApiResponse(data={})
