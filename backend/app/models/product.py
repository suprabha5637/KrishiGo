from sqlalchemy import Column, String, Boolean, DateTime, Integer, Numeric, ForeignKey, Enum as SAEnum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid
from app.database.base import Base

class QualityGrade(str, enum.Enum):
    PREMIUM = "PREMIUM"
    STANDARD = "STANDARD"
    VALUE = "VALUE"

class Category(Base):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    products = relationship("Product", back_populates="category")
    subcategories = relationship("Category")

class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    sku = Column(String, unique=True, index=True, nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"))
    description = Column(String, nullable=True)
    base_price = Column(Numeric(10, 2), nullable=False)
    unit = Column(String, nullable=False)
    is_organic = Column(Boolean, default=False)
    is_quick_delivery_eligible = Column(Boolean, default=False)
    nutritional_info = Column(JSON, nullable=True)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    category = relationship("Category", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    quality_grade = Column(SAEnum(QualityGrade), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    compare_at_price = Column(Numeric(10, 2), nullable=True)
    stock_quantity = Column(Numeric(10, 2), default=0)
    is_active = Column(Boolean, default=True)

    product = relationship("Product", back_populates="variants")
    inventory = relationship("Inventory", back_populates="variant", uselist=False, lazy="selectin")

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    url = Column(String, nullable=False)
    alt_text = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)

    product = relationship("Product", back_populates="images")
