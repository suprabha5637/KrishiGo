from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.database.session import get_db
from app.schemas.order import CartResponse, CartItemCreate, CartItemUpdate
from app.schemas.common import ApiResponse
from app.services.cart_service import CartService
from app.core.dependencies import get_current_active_user
from app.models.user import User

router = APIRouter()
cart_service = CartService()

@router.get("", response_model=ApiResponse[CartResponse])
async def get_cart(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    cart = await cart_service.get_cart(db, current_user.id)
    return ApiResponse(data=cart)

@router.post("/items", response_model=ApiResponse[CartResponse])
async def add_item(
    request: CartItemCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    cart = await cart_service.add_to_cart(db, current_user.id, request)
    return ApiResponse(data=cart)

@router.put("/items/{id}", response_model=ApiResponse[CartResponse])
async def update_item(
    id: UUID,
    request: CartItemUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    cart = await cart_service.update_cart_item(db, current_user.id, id, request)
    return ApiResponse(data=cart)

@router.delete("/items/{id}", response_model=ApiResponse[CartResponse])
async def remove_item(
    id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    cart = await cart_service.remove_from_cart(db, current_user.id, id)
    return ApiResponse(data=cart)

@router.delete("", response_model=ApiResponse[CartResponse])
async def clear_cart(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    cart = await cart_service.clear_cart(db, current_user.id)
    return ApiResponse(data=cart)
