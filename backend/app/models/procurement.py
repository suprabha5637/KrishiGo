from sqlalchemy import Column, String, DateTime, Numeric, ForeignKey, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.database.base import Base

class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    contact_person = Column(String)
    phone = Column(String)
    email = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    gst_number = Column(String)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SupplierProduct(Base):
    __tablename__ = "supplier_products"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    supplier_id = Column(UUID(as_uuid=True), ForeignKey("suppliers.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    price_per_unit = Column(Numeric(10, 2))
    min_order_qty = Column(Numeric(10, 2))
    lead_time_days = Column(Integer)

class ProcurementRequest(Base):
    __tablename__ = "procurement_requests"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    quantity_needed = Column(Numeric(10, 2))
    urgency = Column(String)
    status = Column(String)
    notes = Column(String)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ProcurementOrder(Base):
    __tablename__ = "procurement_orders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    supplier_id = Column(UUID(as_uuid=True), ForeignKey("suppliers.id"), nullable=True)
    farmer_id = Column(UUID(as_uuid=True), ForeignKey("farmers.id"), nullable=True)
    status = Column(String)
    total_amount = Column(Numeric(10, 2))
    expected_delivery = Column(DateTime(timezone=True))
    notes = Column(String)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ProcurementOrderItem(Base):
    __tablename__ = "procurement_order_items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("procurement_orders.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    quantity = Column(Numeric(10, 2))
    unit_price = Column(Numeric(10, 2))
    total_price = Column(Numeric(10, 2))
