from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from decimal import Decimal
from app.models.farmer import FarmingType

class FarmerBase(BaseModel):
    farm_name: Optional[str] = None
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    farm_size_acres: Optional[Decimal] = None
    farming_type: Optional[FarmingType] = None
    bank_account_number: Optional[str] = None
    bank_ifsc: Optional[str] = None

class FarmerCreate(FarmerBase):
    pass

class FarmerResponse(FarmerBase):
    id: UUID
    user_id: UUID
    verification_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

from app.models.farmer import CropStage

class FarmerCropBase(BaseModel):
    crop_name: str
    variety: Optional[str] = None
    area_acres: Decimal
    planting_date: datetime
    expected_harvest_date: Optional[datetime] = None
    stage: CropStage
    irrigation_details: Optional[str] = None
    notes: Optional[str] = None

class FarmerCropCreate(FarmerCropBase):
    pass

class FarmerCropUpdate(BaseModel):
    crop_name: Optional[str] = None
    variety: Optional[str] = None
    area_acres: Optional[Decimal] = None
    planting_date: Optional[datetime] = None
    expected_harvest_date: Optional[datetime] = None
    stage: Optional[CropStage] = None
    irrigation_details: Optional[str] = None
    notes: Optional[str] = None

class FarmerCropResponse(FarmerCropBase):
    id: UUID
    farmer_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class FarmerEarningResponse(BaseModel):
    id: UUID
    farmer_id: UUID
    reference_type: str
    reference_id: UUID
    amount: Decimal
    status: str
    settled_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class FarmerSettlementResponse(BaseModel):
    id: UUID
    farmer_id: UUID
    total_amount: Decimal
    transaction_reference: str
    settled_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
