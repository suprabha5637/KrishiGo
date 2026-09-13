from sqlalchemy import Column, String, DateTime, Numeric, ForeignKey, Enum as SAEnum, Float, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid
from app.database.base import Base

class FarmingType(str, enum.Enum):
    ORGANIC = "ORGANIC"
    CONVENTIONAL = "CONVENTIONAL"
    MIXED = "MIXED"

class CropStage(str, enum.Enum):
    PLANNED = "PLANNED"
    PLANTED = "PLANTED"
    GERMINATION = "GERMINATION"
    VEGETATIVE = "VEGETATIVE"
    FLOWERING = "FLOWERING"
    FRUITING = "FRUITING"
    MATURITY = "MATURITY"
    HARVESTED = "HARVESTED"

class Farmer(Base):
    __tablename__ = "farmers"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    farm_name = Column(String)
    village = Column(String)
    district = Column(String)
    state = Column(String)
    farm_size_acres = Column(Numeric(10, 2))
    farming_type = Column(SAEnum(FarmingType))
    verification_status = Column(String, default="PENDING")
    bank_account_number = Column(String)
    bank_ifsc = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Farm(Base):
    __tablename__ = "farms"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farmer_id = Column(UUID(as_uuid=True), ForeignKey("farmers.id"))
    name = Column(String)
    location = Column(String)
    size_acres = Column(Numeric(10, 2))
    soil_type = Column(String)
    irrigation_type = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)

class FarmerDocument(Base):
    __tablename__ = "farmer_documents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farmer_id = Column(UUID(as_uuid=True), ForeignKey("farmers.id"))
    document_type = Column(String)
    document_url = Column(String)
    is_verified = Column(Boolean, default=False)
    verified_at = Column(DateTime(timezone=True))

class FarmerCrop(Base):
    __tablename__ = "farmer_crops"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farmer_id = Column(UUID(as_uuid=True), ForeignKey("farmers.id"))
    crop_name = Column(String)
    variety = Column(String)
    area_acres = Column(Numeric(10, 2))
    planting_date = Column(DateTime(timezone=True))
    expected_harvest_date = Column(DateTime(timezone=True))
    stage = Column(SAEnum(CropStage))
    irrigation_details = Column(String)
    notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class FarmerEarning(Base):
    __tablename__ = "farmer_earnings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farmer_id = Column(UUID(as_uuid=True), ForeignKey("farmers.id"))
    reference_type = Column(String)
    reference_id = Column(UUID(as_uuid=True))
    amount = Column(Numeric(10, 2))
    status = Column(String)
    settled_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FarmerSettlement(Base):
    __tablename__ = "farmer_settlements"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farmer_id = Column(UUID(as_uuid=True), ForeignKey("farmers.id"))
    total_amount = Column(Numeric(10, 2))
    transaction_reference = Column(String)
    settled_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FarmerStoreProduct(Base):
    __tablename__ = "farmer_store_products"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    slug = Column(String, unique=True)
    category = Column(String)
    description = Column(String)
    price = Column(Numeric(10, 2))
    unit = Column(String)
    image_url = Column(String)
    stock_quantity = Column(Numeric(10, 2))
    is_active = Column(Boolean, default=True)

class FarmerStoreOrder(Base):
    __tablename__ = "farmer_store_orders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farmer_id = Column(UUID(as_uuid=True), ForeignKey("farmers.id"))
    status = Column(String)
    total = Column(Numeric(10, 2))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FarmerStoreOrderItem(Base):
    __tablename__ = "farmer_store_order_items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("farmer_store_orders.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("farmer_store_products.id"))
    quantity = Column(Numeric(10, 2))
    unit_price = Column(Numeric(10, 2))
    total_price = Column(Numeric(10, 2))
