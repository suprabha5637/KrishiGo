from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class LoginRequest(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None

class RegisterRequest(BaseModel):
    name: str = "User"
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = "KrishiGo@123"
    register_as_farmer: bool = False

class PhoneOtpRequest(BaseModel):
    phone: str

class VerifyOtpRequest(BaseModel):
    phone: str
    otp: str
    register_as_farmer: bool = False

class FirebaseAuthRequest(BaseModel):
    id_token: str
    register_as_farmer: bool = False

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    is_farmer: Optional[bool] = None

class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

class OrderCreate(BaseModel):
    delivery_address: Dict[str, Any]
    payment_method: str = "UPI"
    use_wallet: bool = False

class FarmTaskCreate(BaseModel):
    title: str
    field_name: str = "Field 1"
    crop_name: str = "Tomato"
    task_type: str = "Routine"
    scheduled_date: str = "Tomorrow"
    scheduled_time: str = "08:00 AM - 10:00 AM"
    priority: str = "Medium"

class FarmExpenseCreate(BaseModel):
    title: str
    category: str = "Fertilizer"
    amount: float
    date: str

class FarmIncomeCreate(BaseModel):
    title: str
    crop_name: str = "Tomato"
    quantity: float
    unit: str = "kg"
    amount: float
    date: str

class ServiceBookingCreate(BaseModel):
    provider_id: int
    service_name: str
    booking_date: str
    location: str
    notes: Optional[str] = None

class AIQueryRequest(BaseModel):
    prompt: str
    mode: str = "chat" # chat, voice, image, files
    image_url: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class CropHealthDiagnosisRequest(BaseModel):
    crop_name: Optional[str] = "Tomato"
    example_id: Optional[str] = None
    image_url: Optional[str] = None
    image_base64: Optional[str] = None
    condition_description: Optional[str] = None
    symptoms: Optional[str] = None
    location: Optional[str] = "Siliguri, West Bengal"
    lat: Optional[float] = None
    lng: Optional[float] = None

class CropHealthQuestionRequest(BaseModel):
    question: str
    crop_name: Optional[str] = "General Crop"
    location: Optional[str] = "Siliguri, West Bengal"
    lat: Optional[float] = None
    lng: Optional[float] = None

class SoilAnalysisRequest(BaseModel):
    crop: Optional[str] = "Rice"
    image_base64: Optional[str] = None
    report_text: Optional[str] = None
    location: Optional[str] = "Siliguri, West Bengal"
    lat: Optional[float] = None
    lng: Optional[float] = None

class SoilQuestionRequest(BaseModel):
    question: str
    crop: Optional[str] = "Rice"
    location: Optional[str] = "Siliguri, West Bengal"
    lat: Optional[float] = None
    lng: Optional[float] = None

class IrrigationQuestionRequest(BaseModel):
    question: str
    field_name: Optional[str] = "Field 1 (Rice)"
    crop: Optional[str] = "Rice"
    location: Optional[str] = "Siliguri, West Bengal"
    lat: Optional[float] = None
    lng: Optional[float] = None
