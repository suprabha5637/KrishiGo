from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
from uuid import UUID
from decimal import Decimal
from app.models.product import QualityGrade

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    parent_id: Optional[UUID] = None
    sort_order: int = 0
    is_active: bool = True

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: UUID

    class Config:
        from_attributes = True

class InventoryResponse(BaseModel):
    id: UUID
    warehouse_id: UUID
    product_variant_id: UUID
    physical_qty: Decimal
    reserved_qty: Decimal
    available_qty: Decimal
    min_stock_level: Decimal
    reorder_point: Decimal
    updated_at: datetime

    class Config:
        from_attributes = True

class ProductVariantBase(BaseModel):
    quality_grade: QualityGrade
    price: Decimal
    compare_at_price: Optional[Decimal] = None
    stock_quantity: Decimal = Decimal('0')
    is_active: bool = True

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariantResponse(ProductVariantBase):
    id: UUID
    product_id: UUID
    inventory: Optional[InventoryResponse] = None

    class Config:
        from_attributes = True

class ProductImageBase(BaseModel):
    url: str
    alt_text: Optional[str] = None
    sort_order: int = 0

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageResponse(ProductImageBase):
    id: UUID
    product_id: UUID

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    slug: str
    sku: str
    category_id: Optional[UUID] = None
    description: Optional[str] = None
    base_price: Decimal
    unit: str
    is_organic: bool = False
    is_quick_delivery_eligible: bool = False
    nutritional_info: Optional[Any] = None
    status: str = "ACTIVE"

class ProductCreate(ProductBase):
    variants: List[ProductVariantCreate] = []
    images: List[ProductImageCreate] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[Decimal] = None
    status: Optional[str] = None

class ProductResponse(ProductBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryResponse] = None
    variants: List[ProductVariantResponse] = []
    images: List[ProductImageResponse] = []

    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    size: int

class ProductFilterParams(BaseModel):
    category_slug: Optional[str] = None
    min_price: Optional[Decimal] = None
    max_price: Optional[Decimal] = None
    quality_grade: Optional[QualityGrade] = None
    is_organic: Optional[bool] = None
    search: Optional[str] = None
