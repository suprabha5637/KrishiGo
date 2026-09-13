from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class DeliveryPartnerBase(BaseModel):
    vehicle_type: Optional[str] = None
    license_number: Optional[str] = None
    is_available: bool = True
    is_active: bool = True

class DeliveryPartnerCreate(DeliveryPartnerBase):
    pass

class DeliveryPartnerResponse(DeliveryPartnerBase):
    id: UUID
    user_id: UUID
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    total_deliveries: int
    rating: float
    created_at: datetime

    class Config:
        from_attributes = True
