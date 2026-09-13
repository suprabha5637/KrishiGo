from sqlalchemy import Column, String, JSON, DateTime, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.database.base import Base

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(String, nullable=False)
    is_read = Column(String, default="False")
    reference_type = Column(String, nullable=True)
    reference_id = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Review(Base):
    __tablename__ = "reviews"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    rating = Column(Float, nullable=False)
    comment = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SupportTicket(Base):
    __tablename__ = "support_tickets"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    subject = Column(String, nullable=False)
    description = Column(String, nullable=False)
    status = Column(String, default="OPEN")
    priority = Column(String, default="NORMAL")
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False)
    resource = Column(String, nullable=False)
    resource_id = Column(UUID(as_uuid=True), nullable=True)
    metadata_info = Column("metadata", JSON, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DemandForecast(Base):
    __tablename__ = "demand_forecasts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id"))
    forecast_date = Column(DateTime(timezone=True))
    predicted_demand = Column(Float)
    confidence = Column(Float)
    model_version = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class HarvestPrediction(Base):
    __tablename__ = "harvest_predictions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    crop_id = Column(UUID(as_uuid=True), ForeignKey("farmer_crops.id"))
    predicted_maturity_date = Column(DateTime(timezone=True))
    harvest_window_start = Column(DateTime(timezone=True))
    harvest_window_end = Column(DateTime(timezone=True))
    confidence = Column(Float)
    factors = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    score = Column(Float)
    reason = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
