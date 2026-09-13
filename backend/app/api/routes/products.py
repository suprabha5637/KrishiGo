from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from decimal import Decimal
from app.database.session import get_db
from app.schemas.product import ProductFilterParams, ProductListResponse, ProductResponse
from app.schemas.common import ApiResponse
from app.services.product_service import ProductService
from app.models.product import QualityGrade

router = APIRouter()
product_service = ProductService()

@router.get("", response_model=ApiResponse[ProductListResponse])
async def list_products(
    category: Optional[str] = None,
    min_price: Optional[Decimal] = None,
    max_price: Optional[Decimal] = None,
    quality: Optional[QualityGrade] = None,
    organic: Optional[bool] = None,
    q: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    filters = ProductFilterParams(
        category_slug=category,
        min_price=min_price,
        max_price=max_price,
        quality_grade=quality,
        is_organic=organic,
        search=q
    )
    result = await product_service.list_products(db, filters, page, size)
    return ApiResponse(data=result)

@router.get("/{slug}", response_model=ApiResponse[ProductResponse])
async def get_product(slug: str, db: AsyncSession = Depends(get_db)):
    product = await product_service.get_product(db, slug)
    return ApiResponse(data=product)
