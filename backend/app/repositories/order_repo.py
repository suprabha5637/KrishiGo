from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from uuid import UUID
from app.repositories.base import BaseRepository
from app.models.order import Order, OrderItem, OrderEvent, Cart, CartItem, OrderStatus

class OrderRepository(BaseRepository[Order]):
    def __init__(self):
        super().__init__(Order)

    async def get_order_by_id(self, db: AsyncSession, id: UUID) -> Optional[Order]:
        query = select(Order).options(
            selectinload(Order.items),
            selectinload(Order.events)
        ).filter(Order.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_user_orders(self, db: AsyncSession, user_id: UUID, skip: int = 0, limit: int = 50) -> List[Order]:
        query = select(Order).options(
            selectinload(Order.items),
            selectinload(Order.events)
        ).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().unique().all())
        
    async def update_status(self, db: AsyncSession, order_id: UUID, status: OrderStatus, note: str, user_id: UUID):
        order = await self.get_by_id(db, order_id)
        if order:
            order.status = status
            event = OrderEvent(order_id=order_id, status=status, note=note, created_by=user_id)
            db.add(event)
            await db.commit()
            return order
        return None

class CartRepository(BaseRepository[Cart]):
    def __init__(self):
        super().__init__(Cart)

    async def get_cart(self, db: AsyncSession, user_id: UUID) -> Optional[Cart]:
        query = select(Cart).options(selectinload(Cart.items)).filter(Cart.user_id == user_id)
        result = await db.execute(query)
        cart = result.scalars().first()
        if not cart:
            cart = Cart(user_id=user_id)
            db.add(cart)
            await db.commit()
            await db.refresh(cart)
        return cart
        
    async def clear_cart(self, db: AsyncSession, user_id: UUID):
        cart = await self.get_cart(db, user_id)
        if cart:
            for item in cart.items:
                await db.delete(item)
            await db.commit()
