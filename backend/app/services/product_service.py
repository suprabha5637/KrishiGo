from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID
from app.repositories.product_repo import ProductRepository
from app.schemas.product import ProductFilterParams, ProductListResponse, ProductResponse, ProductCreate, ProductUpdate
from app.utils.exceptions import NotFoundException

class ProductService:
    def __init__(self):
        self.product_repo = ProductRepository()
        
    async def list_products(self, db: AsyncSession, filters: ProductFilterParams, page: int = 1, size: int = 50) -> ProductListResponse:
        skip = (page - 1) * size
        items, total = await self.product_repo.list_products(db, filters, skip=skip, limit=size)
        
        return ProductListResponse(
            items=[ProductResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            size=size
        )
        
    async def get_product(self, db: AsyncSession, slug: str) -> ProductResponse:
        product = await self.product_repo.get_by_slug(db, slug)
        if not product:
            raise NotFoundException("Product not found")
        return ProductResponse.model_validate(product)
        
    async def create_product(self, db: AsyncSession, data: ProductCreate) -> ProductResponse:
        # Implementation for creating product, variants, and images
        pass
        
    async def update_product(self, db: AsyncSession, id: UUID, data: ProductUpdate) -> ProductResponse:
        product = await self.product_repo.get_by_id(db, id)
        if not product:
            raise NotFoundException("Product not found")
            
        updated = await self.product_repo.update(db, db_obj=product, obj_in=data.model_dump(exclude_unset=True))
        return ProductResponse.model_validate(updated)
