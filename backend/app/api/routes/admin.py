from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.core.dependencies import get_current_active_user, require_role
from app.models.user import User, UserRole
from app.schemas.common import ApiResponse

router = APIRouter()

@router.get("/dashboard", response_model=ApiResponse)
async def get_dashboard(
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    # Stub logic
    return ApiResponse(data={"stats": "Admin Dashboard Stats Here"})

@router.get("/users", response_model=ApiResponse)
async def get_users(
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    # Stub logic
    return ApiResponse(data={"users": []})

from uuid import UUID
from app.services.admin_service import admin_service
from app.schemas.farmer import FarmerResponse

@router.get("/analytics/revenue")
async def get_revenue(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN))
):
    data = await admin_service.get_revenue_analytics(db)
    return ApiResponse(data=data)

@router.get("/analytics/top-products")
async def get_top_products(
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN))
):
    data = await admin_service.get_top_selling_products(db, limit)
    return ApiResponse(data=data)

@router.put("/farmers/{farmer_id}/verify", response_model=FarmerResponse)
async def verify_farmer(
    farmer_id: UUID,
    status: str = "VERIFIED",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.SUPER_ADMIN))
):
    farmer = await admin_service.verify_farmer(db, farmer_id, status)
    return farmer
