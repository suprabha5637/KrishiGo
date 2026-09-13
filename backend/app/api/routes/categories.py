from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.schemas.common import ApiResponse

router = APIRouter()

@router.get("", response_model=ApiResponse)
async def list_categories(db: AsyncSession = Depends(get_db)):
    return ApiResponse(data=[])

@router.get("/{slug}", response_model=ApiResponse)
async def get_category(slug: str, db: AsyncSession = Depends(get_db)):
    return ApiResponse(data={})

@router.get("/{slug}/products", response_model=ApiResponse)
async def category_products(slug: str, db: AsyncSession = Depends(get_db)):
    return ApiResponse(data=[])

@router.post("", response_model=ApiResponse)
async def create_category(db: AsyncSession = Depends(get_db)):
    return ApiResponse(data={})
