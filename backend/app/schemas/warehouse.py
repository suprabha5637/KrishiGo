from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from decimal import Decimal

class WarehouseBase(BaseModel):
    name: str
    code: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    capacity_kg: Optional[Decimal] = None
    is_active: bool = True

class WarehouseCreate(WarehouseBase):
    pass

class WarehouseResponse(WarehouseBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class InventoryBatchBase(BaseModel):
    inventory_id: UUID
    batch_number: str
    farmer_id: Optional[UUID] = None
    supplier_id: Optional[UUID] = None
    procurement_order_id: Optional[UUID] = None
    received_qty: Decimal
    accepted_qty: Optional[Decimal] = None
    rejected_qty: Optional[Decimal] = None
    quality_grade: Optional[str] = None
    inspection_result: Optional[str] = None
    received_date: datetime
    expiry_date: Optional[datetime] = None
    current_qty: Decimal
    storage_location_id: Optional[UUID] = None

class InventoryBatchCreate(InventoryBatchBase):
    pass

class InventoryBatchResponse(InventoryBatchBase):
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class QualityInspectionBase(BaseModel):
    batch_id: UUID
    weight_kg: Decimal
    appearance_grade: Optional[str] = None
    quality_grade: str
    is_accepted: bool
    notes: Optional[str] = None
    images: Optional[list] = None

class QualityInspectionCreate(QualityInspectionBase):
    pass

class QualityInspectionResponse(QualityInspectionBase):
    id: UUID
    inspector_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
