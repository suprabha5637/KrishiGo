from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List

from app.database.session import get_db
from app.core.dependencies import get_current_active_user, require_role
from app.models.user import User, UserRole
from app.schemas.bulk import (
    BulkRequestCreate, BulkRequestResponse,
    BulkMatchResponse, BulkQuoteResponse
)
from app.services.bulk_service import bulk_service

router = APIRouter()

@router.post("/requests", response_model=BulkRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_request(
    request_in: BulkRequestCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.CUSTOMER, UserRole.ADMIN))
):
    return await bulk_service.create_bulk_request(db, current_user.id, request_in)

@router.post("/{request_id}/match", response_model=List[BulkMatchResponse])
async def run_matching(
    request_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    return await bulk_service.run_matching_algorithm(db, request_id)

@router.post("/{request_id}/quote", response_model=BulkQuoteResponse)
async def generate_quote(
    request_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    return await bulk_service.generate_quote(db, request_id)
