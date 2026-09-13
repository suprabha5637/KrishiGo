from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from decimal import Decimal
from app.database.session import get_db
from app.schemas.product import ProductListResponse
from app.schemas.common import ApiResponse
from app.services.product_service import ProductService
from app.schemas.product import ProductFilterParams

router = APIRouter()
product_service = ProductService()

@router.get("", response_model=ApiResponse[ProductListResponse])
async def search(
    q: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[Decimal] = None,
    max_price: Optional[Decimal] = None,
    quality: Optional[str] = None,
    organic: Optional[bool] = None,
    sort: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    filters = ProductFilterParams(
        search=q,
        category_slug=category,
        min_price=min_price,
        max_price=max_price,
        quality_grade=quality,
        is_organic=organic
    )
    # Reusing list_products for now
    result = await product_service.list_products(db, filters)
    return ApiResponse(data=result)
