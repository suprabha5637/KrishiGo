from sqlalchemy import Column, String, DateTime, Numeric, ForeignKey, Enum as SAEnum, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid
from app.database.base import Base

class BulkStatus(str, enum.Enum):
    REQUESTED = "REQUESTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    MATCHING = "MATCHING"
    QUOTED = "QUOTED"
    CUSTOMER_ACCEPTED = "CUSTOMER_ACCEPTED"
    SCHEDULED = "SCHEDULED"
    FULFILLING = "FULFILLING"
    DELIVERED = "DELIVERED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class BulkRequest(Base):
    __tablename__ = "bulk_requests"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    status = Column(SAEnum(BulkStatus), default=BulkStatus.REQUESTED)
    delivery_date = Column(DateTime(timezone=True))
    delivery_city = Column(String)
    delivery_address = Column(String)
    packaging_requirements = Column(String)
    special_requirements = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class BulkItem(Base):
    __tablename__ = "bulk_items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id = Column(UUID(as_uuid=True), ForeignKey("bulk_requests.id"))
    product_name = Column(String)
    quantity = Column(Numeric(10, 2))
    quantity_unit = Column(String)
    quality_grade = Column(String)
    notes = Column(String)

class BulkMatch(Base):
    __tablename__ = "bulk_matches"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id = Column(UUID(as_uuid=True), ForeignKey("bulk_requests.id"))
    farmer_id = Column(UUID(as_uuid=True), ForeignKey("farmers.id"), nullable=True)
    supplier_id = Column(UUID(as_uuid=True), ForeignKey("suppliers.id"), nullable=True)
    product_name = Column(String)
    available_qty = Column(Numeric(10, 2))
    price_per_unit = Column(Numeric(10, 2))
    distance_km = Column(Float)

class BulkQuote(Base):
    __tablename__ = "bulk_quotes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id = Column(UUID(as_uuid=True), ForeignKey("bulk_requests.id"))
    subtotal = Column(Numeric(10, 2))
    service_fee = Column(Numeric(10, 2))
    logistics_fee = Column(Numeric(10, 2))
    total = Column(Numeric(10, 2))
    valid_until = Column(DateTime(timezone=True))
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BulkQuoteItem(Base):
    __tablename__ = "bulk_quote_items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quote_id = Column(UUID(as_uuid=True), ForeignKey("bulk_quotes.id"))
    match_id = Column(UUID(as_uuid=True), ForeignKey("bulk_matches.id"))
    quantity = Column(Numeric(10, 2))
    unit_price = Column(Numeric(10, 2))
    total_price = Column(Numeric(10, 2))
