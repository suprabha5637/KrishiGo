from sqlalchemy import Column, String, DateTime, Numeric, ForeignKey, Enum as SAEnum, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid
from app.database.base import Base

class OrderStatus(str, enum.Enum):
    ORDER_PLACED = "ORDER_PLACED"
    CONFIRMED = "CONFIRMED"
    INVENTORY_RESERVED = "INVENTORY_RESERVED"
    PICKING = "PICKING"
    PACKED = "PACKED"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"
    REFUNDED = "REFUNDED"

class PaymentStatus(str, enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"

class Cart(Base):
    __tablename__ = "carts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

class CartItem(Base):
    __tablename__ = "cart_items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cart_id = Column(UUID(as_uuid=True), ForeignKey("carts.id", ondelete="CASCADE"))
    product_variant_id = Column(UUID(as_uuid=True), ForeignKey("product_variants.id"))
    quantity = Column(Numeric(10, 2), nullable=False)
    
    cart = relationship("Cart", back_populates="items")

class Wishlist(Base):
    __tablename__ = "wishlists"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Order(Base):
    __tablename__ = "orders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    address_id = Column(UUID(as_uuid=True), ForeignKey("addresses.id"))
    status = Column(SAEnum(OrderStatus), default=OrderStatus.ORDER_PLACED)
    subtotal = Column(Numeric(10, 2), nullable=False)
    delivery_fee = Column(Numeric(10, 2), default=0)
    discount = Column(Numeric(10, 2), default=0)
    tax = Column(Numeric(10, 2), default=0)
    total = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(String)
    payment_status = Column(SAEnum(PaymentStatus), default=PaymentStatus.PENDING)
    delivery_type = Column(String)
    estimated_delivery = Column(DateTime(timezone=True))
    warehouse_id = Column(UUID(as_uuid=True), ForeignKey("warehouses.id"), nullable=True)
    notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    events = relationship("OrderEvent", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"))
    product_variant_id = Column(UUID(as_uuid=True), ForeignKey("product_variants.id"))
    product_name = Column(String)
    quality_grade = Column(String)
    quantity = Column(Numeric(10, 2), nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)
    
    order = relationship("Order", back_populates="items")

class OrderEvent(Base):
    __tablename__ = "order_events"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"))
    status = Column(String)
    note = Column(String)
    created_by = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    order = relationship("Order", back_populates="events")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"))
    method = Column(String)
    amount = Column(Numeric(10, 2))
    status = Column(SAEnum(PaymentStatus))
    transaction_id = Column(String)
    provider_response = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Refund(Base):
    __tablename__ = "refunds"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"))
    payment_id = Column(UUID(as_uuid=True), ForeignKey("payments.id"))
    amount = Column(Numeric(10, 2))
    reason = Column(String)
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
