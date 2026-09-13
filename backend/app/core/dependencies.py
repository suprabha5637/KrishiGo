from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Callable, List, Optional
from uuid import UUID

from app.database.session import get_db
from app.core.security import verify_token
from app.models.user import User, UserRole
from app.repositories.user_repo import UserRepository
from app.utils.exceptions import UnauthorizedException, ForbiddenException

security = HTTPBearer()
user_repo = UserRepository()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    try:
        payload = verify_token(credentials.credentials)
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise UnauthorizedException("Could not validate credentials")
        try:
            user_id = UUID(user_id_str)
        except ValueError:
            raise UnauthorizedException("Invalid token payload")
            
    except Exception:
        raise UnauthorizedException("Could not validate credentials")

    user = await user_repo.get_by_id(db, user_id)
    if user is None:
        raise UnauthorizedException("User not found")
    
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise ForbiddenException("Inactive user")
    return current_user

def require_role(*roles: UserRole) -> Callable:
    async def role_dependency(current_user: User = Depends(get_current_active_user)) -> User:
        if current_user.role not in roles and current_user.role != UserRole.SUPER_ADMIN:
            raise ForbiddenException("You don't have enough privileges")
        return current_user
    return role_dependency
