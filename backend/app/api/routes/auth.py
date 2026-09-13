from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, RefreshRequest
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.common import ApiResponse

router = APIRouter()
auth_service = AuthService()

@router.post("/register", response_model=ApiResponse[UserResponse])
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    user = await auth_service.register(db, request)
    return ApiResponse(data=user)

@router.post("/login", response_model=ApiResponse[TokenResponse])
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    tokens = await auth_service.login(db, request)
    return ApiResponse(data=tokens)

@router.post("/refresh", response_model=ApiResponse[TokenResponse])
async def refresh(request: RefreshRequest, db: AsyncSession = Depends(get_db)):
    tokens = await auth_service.refresh_token(db, request.refresh_token)
    return ApiResponse(data=tokens)

@router.get("/me", response_model=ApiResponse[UserResponse])
async def get_me(current_user: User = Depends(get_current_active_user)):
    return ApiResponse(data=UserResponse.model_validate(current_user))
