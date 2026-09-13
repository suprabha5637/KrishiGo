from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SAEnum, Boolean, Float, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid
from app.database.base import Base

class DeliveryStatus(str, enum.Enum):
    ASSIGNED = "ASSIGNED"
    ACCEPTED = "ACCEPTED"
    PICKUP_PENDING = "PICKUP_PENDING"
    PICKED_UP = "PICKED_UP"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
    ARRIVED = "ARRIVED"
    DELIVERED = "DELIVERED"
    FAILED = "FAILED"

class DeliveryPartner(Base):
    __tablename__ = "delivery_partners"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    vehicle_type = Column(String)
    license_number = Column(String)
    is_available = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    current_latitude = Column(Float, nullable=True)
    current_longitude = Column(Float, nullable=True)
    total_deliveries = Column(Integer, default=0)
    rating = Column(Float, default=5.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DeliveryAssignment(Base):
    __tablename__ = "delivery_assignments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"))
    partner_id = Column(UUID(as_uuid=True), ForeignKey("delivery_partners.id"))
    status = Column(SAEnum(DeliveryStatus), default=DeliveryStatus.ASSIGNED)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    accepted_at = Column(DateTime(timezone=True), nullable=True)
    picked_up_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    otp_code = Column(String, nullable=True)
    delivery_notes = Column(String, nullable=True)

class DeliveryEvent(Base):
    __tablename__ = "delivery_events"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assignment_id = Column(UUID(as_uuid=True), ForeignKey("delivery_assignments.id"))
    status = Column(String)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    note = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DeliveryProof(Base):
    __tablename__ = "delivery_proofs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assignment_id = Column(UUID(as_uuid=True), ForeignKey("delivery_assignments.id"))
    photo_url = Column(String)
    otp_verified = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
