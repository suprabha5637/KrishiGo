from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from uuid import UUID
from decimal import Decimal
from app.repositories.order_repo import CartRepository
from app.repositories.product_repo import ProductRepository
from app.repositories.base import BaseRepository
from app.models.product import ProductVariant
from app.models.order import CartItem
from app.schemas.order import CartResponse, CartItemCreate, CartItemUpdate
from app.utils.exceptions import NotFoundException

class CartService:
    def __init__(self):
        self.cart_repo = CartRepository()
        self.variant_repo = BaseRepository(ProductVariant)
        self.item_repo = BaseRepository(CartItem)
        
    async def get_cart(self, db: AsyncSession, user_id: UUID) -> CartResponse:
        cart = await self.cart_repo.get_cart(db, user_id)
        return CartResponse.model_validate(cart)
        
    async def add_to_cart(self, db: AsyncSession, user_id: UUID, data: CartItemCreate) -> CartResponse:
        cart = await self.cart_repo.get_cart(db, user_id)
        
        # Check if variant exists
        variant = await self.variant_repo.get_by_id(db, data.product_variant_id)
        if not variant or not variant.is_active:
            raise NotFoundException("Product variant not found")
            
        # Check if already in cart
        existing_item = next((item for item in cart.items if item.product_variant_id == data.product_variant_id), None)
        
        if existing_item:
            existing_item.quantity += data.quantity
            db.add(existing_item)
        else:
            new_item = CartItem(
                cart_id=cart.id,
                product_variant_id=data.product_variant_id,
                quantity=data.quantity
            )
            db.add(new_item)
            
        await db.commit()
        await db.refresh(cart)
        return CartResponse.model_validate(cart)
        
    async def update_cart_item(self, db: AsyncSession, user_id: UUID, item_id: UUID, data: CartItemUpdate) -> CartResponse:
        cart = await self.cart_repo.get_cart(db, user_id)
        item = next((item for item in cart.items if item.id == item_id), None)
        
        if not item:
            raise NotFoundException("Cart item not found")
            
        item.quantity = data.quantity
        db.add(item)
        await db.commit()
        await db.refresh(cart)
        return CartResponse.model_validate(cart)
        
    async def remove_from_cart(self, db: AsyncSession, user_id: UUID, item_id: UUID) -> CartResponse:
        cart = await self.cart_repo.get_cart(db, user_id)
        item = next((item for item in cart.items if item.id == item_id), None)
        
        if item:
            await db.delete(item)
            await db.commit()
            await db.refresh(cart)
            
        return CartResponse.model_validate(cart)

    async def clear_cart(self, db: AsyncSession, user_id: UUID) -> CartResponse:
        await self.cart_repo.clear_cart(db, user_id)
        cart = await self.cart_repo.get_cart(db, user_id)
        return CartResponse.model_validate(cart)
