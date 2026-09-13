from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from uuid import UUID
from decimal import Decimal

from app.repositories.order_repo import OrderRepository, CartRepository
from app.repositories.base import BaseRepository
from app.models.order import Order, OrderItem, OrderEvent, OrderStatus, PaymentStatus, Cart
from app.models.warehouse import Inventory, StockMovement, MovementType
from app.models.product import ProductVariant, Product
from app.models.user import Address
from app.schemas.order import OrderCreate, OrderResponse
from app.utils.exceptions import NotFoundException, InsufficientInventoryException, ValidationException
from app.utils.helpers import generate_order_number

class OrderService:
    def __init__(self):
        self.order_repo = OrderRepository()
        self.cart_repo = CartRepository()
        
    async def create_order(self, db: AsyncSession, user_id: UUID, data: OrderCreate) -> OrderResponse:
        cart = await self.cart_repo.get_cart(db, user_id)
        if not cart.items:
            raise ValidationException("Cart is empty")
            
        # Address validation
        address_repo = BaseRepository(Address)
        address = await address_repo.get_by_id(db, data.address_id)
        if not address or address.user_id != user_id:
            raise NotFoundException("Address not found")
            
        subtotal = Decimal('0')
        order_items_data = []
        
        # Calculate totals and prepare items
        for item in cart.items:
            # Load variant
            variant_query = select(ProductVariant).join(Product).options(selectinload(ProductVariant.product)).filter(ProductVariant.id == item.product_variant_id)
            variant_res = await db.execute(variant_query)
            variant = variant_res.scalars().first()
            if not variant:
                raise NotFoundException(f"Product variant {item.product_variant_id} not found")
            
            unit_price = variant.price
            total_price = unit_price * item.quantity
            subtotal += total_price
            
            order_items_data.append({
                "variant": variant,
                "quantity": item.quantity,
                "unit_price": unit_price,
                "total_price": total_price
            })
            
        delivery_fee = Decimal('50.00')
        tax = subtotal * Decimal('0.05')
        total = subtotal + delivery_fee + tax
        
        # Create order
        order = Order(
            order_number=generate_order_number(),
            user_id=user_id,
            address_id=data.address_id,
            status=OrderStatus.ORDER_PLACED,
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            tax=tax,
            total=total,
            payment_method=data.payment_method,
            payment_status=PaymentStatus.PENDING,
            delivery_type=data.delivery_type,
            notes=data.notes
        )
        db.add(order)
        await db.flush() # get order.id
        
        # Reserve inventory and add items
        for item_data in order_items_data:
            variant = item_data["variant"]
            qty = item_data["quantity"]
            
            inventory_query = select(Inventory).filter(
                Inventory.product_variant_id == variant.id
            ).with_for_update()
            
            inventory_res = await db.execute(inventory_query)
            inventory = inventory_res.scalars().first()
            
            if not inventory or inventory.available_qty < qty:
                raise InsufficientInventoryException(f"Not enough inventory for {variant.product.name}")
                
            inventory.available_qty -= qty
            inventory.reserved_qty += qty
            db.add(inventory)
            
            order_item = OrderItem(
                order_id=order.id,
                product_variant_id=variant.id,
                product_name=variant.product.name,
                quality_grade=variant.quality_grade.value if hasattr(variant.quality_grade, "value") else variant.quality_grade,
                quantity=qty,
                unit_price=item_data["unit_price"],
                total_price=item_data["total_price"]
            )
            db.add(order_item)
            
            movement = StockMovement(
                inventory_id=inventory.id,
                movement_type=MovementType.RESERVATION,
                quantity=qty,
                reference_type="ORDER",
                reference_id=order.id,
                note=f"Reserved for order {order.order_number}",
                created_by=user_id
            )
            db.add(movement)
            
        # Add event
        event = OrderEvent(
            order_id=order.id,
            status=OrderStatus.ORDER_PLACED,
            note="Order placed successfully",
            created_by=user_id
        )
        db.add(event)
        
        # Clear cart
        await self.cart_repo.clear_cart(db, user_id)
        
        await db.commit()
        await db.refresh(order, ["items", "events"])
        
        return OrderResponse.model_validate(order)
        
    async def get_orders(self, db: AsyncSession, user_id: UUID, skip: int = 0, limit: int = 50) -> List[OrderResponse]:
        orders = await self.order_repo.get_user_orders(db, user_id, skip, limit)
        return [OrderResponse.model_validate(order) for order in orders]
        
    async def get_order(self, db: AsyncSession, order_id: UUID, user_id: UUID) -> OrderResponse:
        order = await self.order_repo.get_order_by_id(db, order_id)
        if not order or order.user_id != user_id:
            raise NotFoundException("Order not found")
        return OrderResponse.model_validate(order)
