from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.database.session import get_db
from app.core.dependencies import get_current_active_user, require_role
from app.models.user import User, UserRole
from app.schemas.warehouse import (
    InventoryBatchCreate, InventoryBatchResponse,
    QualityInspectionCreate, QualityInspectionResponse
)
from app.schemas.order import OrderResponse
from app.services.warehouse_service import warehouse_service

router = APIRouter()

@router.post("/batches", response_model=InventoryBatchResponse, status_code=status.HTTP_201_CREATED)
async def receive_inventory_batch(
    batch_in: InventoryBatchCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.WAREHOUSE_STAFF, UserRole.ADMIN))
):
    return await warehouse_service.receive_batch(db, batch_in)

@router.post("/inspections", response_model=QualityInspectionResponse, status_code=status.HTTP_201_CREATED)
async def perform_quality_inspection(
    inspection_in: QualityInspectionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.WAREHOUSE_STAFF, UserRole.ADMIN))
):
    return await warehouse_service.create_quality_inspection(db, current_user.id, inspection_in)

@router.put("/orders/{order_id}/fulfillment", response_model=OrderResponse)
async def update_order_fulfillment(
    order_id: UUID,
    status: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.WAREHOUSE_STAFF, UserRole.ADMIN))
):
    return await warehouse_service.update_order_fulfillment(db, order_id, status)
