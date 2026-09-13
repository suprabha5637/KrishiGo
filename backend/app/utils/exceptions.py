from fastapi import HTTPException
from typing import Any, Dict, Optional

class AppException(HTTPException):
    def __init__(self, status_code: int, code: str, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(status_code=status_code, detail={"code": code, "message": message, "details": details})

class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found", details: Optional[Dict[str, Any]] = None):
        super().__init__(status_code=404, code="NOT_FOUND", message=message, details=details)

class UnauthorizedException(AppException):
    def __init__(self, message: str = "Unauthorized", details: Optional[Dict[str, Any]] = None):
        super().__init__(status_code=401, code="UNAUTHORIZED", message=message, details=details)

class ForbiddenException(AppException):
    def __init__(self, message: str = "Forbidden", details: Optional[Dict[str, Any]] = None):
        super().__init__(status_code=403, code="FORBIDDEN", message=message, details=details)

class ConflictException(AppException):
    def __init__(self, message: str = "Conflict", details: Optional[Dict[str, Any]] = None):
        super().__init__(status_code=409, code="CONFLICT", message=message, details=details)

class ValidationException(AppException):
    def __init__(self, message: str = "Validation failed", details: Optional[Dict[str, Any]] = None):
        super().__init__(status_code=422, code="VALIDATION_ERROR", message=message, details=details)

class InsufficientInventoryException(AppException):
    def __init__(self, message: str = "Insufficient inventory", details: Optional[Dict[str, Any]] = None):
        super().__init__(status_code=400, code="INSUFFICIENT_INVENTORY", message=message, details=details)

class PaymentFailedException(AppException):
    def __init__(self, message: str = "Payment failed", details: Optional[Dict[str, Any]] = None):
        super().__init__(status_code=402, code="PAYMENT_FAILED", message=message, details=details)
