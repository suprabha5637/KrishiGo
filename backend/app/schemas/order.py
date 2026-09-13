from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from decimal import Decimal
from app.models.order import OrderStatus, PaymentStatus

class CartItemBase(BaseModel):
    product_variant_id: UUID
    quantity: Decimal

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: Decimal

class CartItemResponse(CartItemBase):
    id: UUID
    cart_id: UUID

    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    items: List[CartItemResponse] = []

    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    product_variant_id: UUID
    product_name: str
    quality_grade: str
    quantity: Decimal
    unit_price: Decimal
    total_price: Decimal

class OrderItemResponse(OrderItemBase):
    id: UUID
    order_id: UUID

    class Config:
        from_attributes = True

class OrderEventResponse(BaseModel):
    id: UUID
    order_id: UUID
    status: str
    note: Optional[str] = None
    created_by: Optional[UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    address_id: UUID
    payment_method: str
    delivery_type: str
    notes: Optional[str] = None

class OrderResponse(BaseModel):
    id: UUID
    order_number: str
    user_id: UUID
    address_id: UUID
    status: OrderStatus
    subtotal: Decimal
    delivery_fee: Decimal
    discount: Decimal
    tax: Decimal
    total: Decimal
    payment_method: str
    payment_status: PaymentStatus
    delivery_type: str
    estimated_delivery: Optional[datetime] = None
    warehouse_id: Optional[UUID] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []
    events: List[OrderEventResponse] = []

    class Config:
        from_attributes = True

class PaymentCreate(BaseModel):
    method: str
    amount: Decimal
    
class PaymentResponse(BaseModel):
    id: UUID
    order_id: UUID
    method: str
    amount: Decimal
    status: PaymentStatus
    transaction_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
