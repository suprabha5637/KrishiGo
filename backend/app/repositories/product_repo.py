from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import or_, and_, func
from app.repositories.base import BaseRepository
from app.models.product import Product, Category, ProductVariant, QualityGrade
from app.schemas.product import ProductFilterParams

class ProductRepository(BaseRepository[Product]):
    def __init__(self):
        super().__init__(Product)

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Product]:
        query = select(Product).options(
            selectinload(Product.variants).selectinload(ProductVariant.inventory),
            selectinload(Product.images),
            selectinload(Product.category)
        ).filter(Product.slug == slug, Product.status == "ACTIVE")
        result = await db.execute(query)
        return result.scalars().first()

    async def list_products(self, db: AsyncSession, filters: ProductFilterParams, skip: int = 0, limit: int = 100) -> Tuple[List[Product], int]:
        query = select(Product).options(
            selectinload(Product.variants),
            selectinload(Product.images),
            selectinload(Product.category)
        ).filter(Product.status == "ACTIVE")

        if filters.search:
            search_term = f"%{filters.search}%"
            query = query.filter(or_(Product.name.ilike(search_term), Product.description.ilike(search_term)))
            
        if filters.min_price is not None:
            query = query.filter(Product.base_price >= filters.min_price)
            
        if filters.max_price is not None:
            query = query.filter(Product.base_price <= filters.max_price)
            
        if filters.is_organic is not None:
            query = query.filter(Product.is_organic == filters.is_organic)

        if filters.category_slug:
            query = query.join(Category).filter(Category.slug == filters.category_slug)
            
        if filters.quality_grade:
            query = query.join(ProductVariant).filter(ProductVariant.quality_grade == filters.quality_grade)

        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        items = list(result.scalars().unique().all())

        return items, total
