from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repo import UserRepository
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.schemas.user import UserResponse
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, verify_token
from app.utils.exceptions import ConflictException, UnauthorizedException
from datetime import timedelta
from app.core.config import settings
from typing import Dict, Any

class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()
        
    async def register(self, db: AsyncSession, request: RegisterRequest) -> UserResponse:
        existing_user = await self.user_repo.get_by_email(db, request.email)
        if existing_user:
            raise ConflictException("Email already registered")
            
        existing_phone = await self.user_repo.get_by_phone(db, request.phone)
        if existing_phone:
            raise ConflictException("Phone number already registered")
            
        hashed_pw = hash_password(request.password)
        
        user_data = {
            "email": request.email,
            "phone": request.phone,
            "full_name": request.full_name,
            "password_hash": hashed_pw,
            "role": request.role
        }
        
        user = await self.user_repo.create(db, obj_in=user_data)
        return UserResponse.model_validate(user)
        
    async def login(self, db: AsyncSession, request: LoginRequest) -> TokenResponse:
        user = await self.user_repo.get_by_email(db, request.email)
        if not user or not verify_password(request.password, user.password_hash):
            raise UnauthorizedException("Incorrect email or password")
            
        if not user.is_active:
            raise UnauthorizedException("Inactive user")
            
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )
        
    async def refresh_token(self, db: AsyncSession, refresh_token: str) -> TokenResponse:
        try:
            payload = verify_token(refresh_token)
            user_id = payload.get("sub")
            if not user_id:
                raise UnauthorizedException("Invalid token payload")
        except Exception:
            raise UnauthorizedException("Invalid token")
            
        user = await self.user_repo.get_by_id(db, user_id)
        if not user or not user.is_active:
            raise UnauthorizedException("User not found or inactive")
            
        access_token = create_access_token(data={"sub": str(user.id)})
        new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )
