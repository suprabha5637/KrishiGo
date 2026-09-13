from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from decimal import Decimal

class SupplierBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    gst_number: Optional[str] = None
    is_verified: bool = False
    is_active: bool = True

class SupplierCreate(SupplierBase):
    pass

class SupplierResponse(SupplierBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
