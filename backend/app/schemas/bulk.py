from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.bulk import BulkStatus

class BulkRequestBase(BaseModel):
    delivery_date: Optional[datetime] = None
    delivery_city: Optional[str] = None
    delivery_address: Optional[str] = None
    packaging_requirements: Optional[str] = None
    special_requirements: Optional[str] = None

class BulkRequestCreate(BulkRequestBase):
    pass

class BulkRequestResponse(BulkRequestBase):
    id: UUID
    customer_id: UUID
    status: BulkStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
from decimal import Decimal

class BulkQuoteResponse(BaseModel):
    id: UUID
    request_id: UUID
    subtotal: Decimal
    service_fee: Decimal
    logistics_fee: Decimal
    total: Decimal
    valid_until: Optional[datetime] = None
    status: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class BulkMatchResponse(BaseModel):
    id: UUID
    request_id: UUID
    farmer_id: Optional[UUID] = None
    supplier_id: Optional[UUID] = None
    product_name: str
    available_qty: Decimal
    price_per_unit: Decimal
    distance_km: Optional[float] = None

    class Config:
        from_attributes = True
