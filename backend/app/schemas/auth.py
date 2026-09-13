from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole
from app.schemas.user import UserResponse

class RegisterRequest(BaseModel):
    email: EmailStr
    phone: str
    full_name: str
    password: str
    role: UserRole

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: UserResponse

class RefreshRequest(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
