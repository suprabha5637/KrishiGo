from sqlalchemy import Column, String, Boolean, DateTime, Enum as SAEnum, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid
from app.database.base import Base

class UserRole(str, enum.Enum):
    CUSTOMER = "CUSTOMER"
    FARMER = "FARMER"
    DELIVERY_PARTNER = "DELIVERY_PARTNER"
    WAREHOUSE_STAFF = "WAREHOUSE_STAFF"
    PROCUREMENT_MANAGER = "PROCUREMENT_MANAGER"
    ADMIN = "ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(SAEnum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")

class Address(Base):
    __tablename__ = "addresses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address_line1 = Column(String, nullable=False)
    address_line2 = Column(String, nullable=True)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    pincode = Column(String, nullable=False)
    landmark = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="addresses")
