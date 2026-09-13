from typing import TypeVar, Generic, Optional, List, Dict, Any
from pydantic import BaseModel

T = TypeVar('T')

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Dict[str, Any]] = None

class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail

class SuccessResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None

class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None

class PaginatedResponse(BaseModel, Generic[T]):
    success: bool = True
    data: List[T]
    total: int
    page: int
    size: int
