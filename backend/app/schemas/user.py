from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from app.models.user import UserRole

class AddressBase(BaseModel):
    name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    pincode: str
    landmark: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_default: bool = False

class AddressCreate(AddressBase):
    pass

class AddressUpdate(AddressBase):
    name: Optional[str] = None
    phone: Optional[str] = None
    address_line1: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

class AddressResponse(AddressBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    phone: str
    full_name: str
    role: UserRole
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
