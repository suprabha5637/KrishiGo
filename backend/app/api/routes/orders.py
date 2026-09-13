from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID
from app.database.session import get_db
from app.schemas.order import OrderCreate, OrderResponse
from app.schemas.common import ApiResponse
from app.services.order_service import OrderService
from app.core.dependencies import get_current_active_user
from app.models.user import User

router = APIRouter()
order_service = OrderService()

@router.post("", response_model=ApiResponse[OrderResponse])
async def create_order(
    request: OrderCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    order = await order_service.create_order(db, current_user.id, request)
    return ApiResponse(data=order)

@router.get("", response_model=ApiResponse[List[OrderResponse]])
async def get_orders(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    orders = await order_service.get_orders(db, current_user.id, skip, limit)
    return ApiResponse(data=orders)

@router.get("/{id}", response_model=ApiResponse[OrderResponse])
async def get_order(
    id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    order = await order_service.get_order(db, id, current_user.id)
    return ApiResponse(data=order)
