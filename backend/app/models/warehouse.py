from sqlalchemy import Column, String, DateTime, Numeric, ForeignKey, Enum as SAEnum, Boolean, Float, CheckConstraint, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid
from app.database.base import Base

class MovementType(str, enum.Enum):
    RECEIPT = "RECEIPT"
    TRANSFER = "TRANSFER"
    RESERVATION = "RESERVATION"
    PICK = "PICK"
    DISPATCH = "DISPATCH"
    RETURN = "RETURN"
    WASTAGE = "WASTAGE"
    ADJUSTMENT = "ADJUSTMENT"

class Warehouse(Base):
    __tablename__ = "warehouses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    pincode = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    capacity_kg = Column(Numeric(10, 2))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class StorageLocation(Base):
    __tablename__ = "warehouse_locations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id"))
    zone = Column(String)
    aisle = Column(String)
    rack = Column(String)
    bin = Column(String)
    capacity = Column(Numeric(10, 2))

class Inventory(Base):
    __tablename__ = "inventory"
    __table_args__ = (CheckConstraint('available_qty >= 0', name='check_available_qty_positive'),)
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id"))
    product_variant_id = Column(UUID(as_uuid=True), ForeignKey("product_variants.id"))
    physical_qty = Column(Numeric(10, 2), default=0)
    reserved_qty = Column(Numeric(10, 2), default=0)
    available_qty = Column(Numeric(10, 2), default=0)
    min_stock_level = Column(Numeric(10, 2), default=0)
    reorder_point = Column(Numeric(10, 2), default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    variant = relationship("ProductVariant", back_populates="inventory")

class InventoryBatch(Base):
    __tablename__ = "inventory_batches"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    inventory_id = Column(UUID(as_uuid=True), ForeignKey("inventory.id"))
    batch_number = Column(String, unique=True)
    farmer_id = Column(UUID(as_uuid=True), ForeignKey("farmers.id"), nullable=True)
    supplier_id = Column(UUID(as_uuid=True), ForeignKey("suppliers.id"), nullable=True)
    procurement_order_id = Column(UUID(as_uuid=True), ForeignKey("procurement_orders.id"), nullable=True)
    received_qty = Column(Numeric(10, 2))
    accepted_qty = Column(Numeric(10, 2))
    rejected_qty = Column(Numeric(10, 2))
    quality_grade = Column(String)
    inspection_result = Column(String)
    received_date = Column(DateTime(timezone=True))
    expiry_date = Column(DateTime(timezone=True))
    current_qty = Column(Numeric(10, 2))
    storage_location_id = Column(UUID(as_uuid=True), ForeignKey("warehouse_locations.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class StockMovement(Base):
    __tablename__ = "stock_movements"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("inventory_batches.id"), nullable=True)
    inventory_id = Column(UUID(as_uuid=True), ForeignKey("inventory.id"))
    movement_type = Column(SAEnum(MovementType))
    quantity = Column(Numeric(10, 2))
    reference_type = Column(String)
    reference_id = Column(UUID(as_uuid=True))
    note = Column(String)
    created_by = Column(UUID(as_uuid=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class QualityInspection(Base):
    __tablename__ = "quality_inspections"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("inventory_batches.id"))
    inspector_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    weight_kg = Column(Numeric(10, 2))
    appearance_grade = Column(String)
    quality_grade = Column(String)
    is_accepted = Column(Boolean)
    notes = Column(String)
    images = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class WastageRecord(Base):
    __tablename__ = "wastage_records"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("inventory_batches.id"))
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    quantity = Column(Numeric(10, 2))
    value = Column(Numeric(10, 2))
    reason = Column(String)
    recorded_by = Column(UUID(as_uuid=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
