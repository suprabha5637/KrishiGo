from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.database.session import get_db
from app.schemas.common import ApiResponse

router = APIRouter()

@router.get("", response_model=ApiResponse)
async def get_addresses(db: AsyncSession = Depends(get_db)):
    return ApiResponse(data=[])

@router.post("", response_model=ApiResponse)
async def create_address(db: AsyncSession = Depends(get_db)):
    return ApiResponse(data={})

@router.put("/{id}", response_model=ApiResponse)
async def update_address(id: UUID, db: AsyncSession = Depends(get_db)):
    return ApiResponse(data={})

@router.delete("/{id}", response_model=ApiResponse)
async def delete_address(id: UUID, db: AsyncSession = Depends(get_db)):
    return ApiResponse(data={})
