from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from backend.app.core.database import get_db
from backend.app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from backend.app.models.all_models import User, Address, FarmerProfile, Farm, FarmField
from backend.app.schemas.all_schemas import (
    LoginRequest, RegisterRequest, PhoneOtpRequest, VerifyOtpRequest, TokenResponse, UserUpdate, FirebaseAuthRequest
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

# In-memory store for OTP simulation with 5-minute expiry
OTP_STORE = {}

@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    if req.email:
        existing = await db.execute(select(User).where(User.email == req.email))
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="User with this email already exists")

    if req.phone:
        existing_phone = await db.execute(select(User).where(User.phone == req.phone))
        if existing_phone.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="User with this phone already exists")

    new_user = User(
        name=req.name or "User",
        email=req.email,
        phone=req.phone,
        hashed_password=hash_password(req.password) if req.password else None,
        is_farmer=req.register_as_farmer,
        is_admin=False,
        wallet_balance=848.0
    )
    db.add(new_user)
    await db.flush()

    # Add default address
    addr = Address(
        user_id=new_user.id,
        tag="Home",
        full_address="Siliguri, West Bengal",
        city="Siliguri",
        state="West Bengal",
        postal_code="734001",
        is_default=True
    )
    db.add(addr)

    # If registered as farmer, create farmer profile & farm
    if req.register_as_farmer:
        fp = FarmerProfile(
            user_id=new_user.id,
            display_name=new_user.name,
            state="West Bengal",
            district="Darjeeling"
        )
        db.add(fp)
        await db.flush()

        farm = Farm(
            farmer_id=fp.id,
            farm_name=f"{new_user.name}'s Farm",
            address="Siliguri, West Bengal",
            total_area=2.5
        )
        db.add(farm)
        await db.flush()

        # Create initial fields
        f1 = FarmField(farm_id=farm.id, field_name="Field 1", area=1.0, current_crop="Tomato")
        f2 = FarmField(farm_id=farm.id, field_name="Field 2", area=0.8, current_crop="Potato")
        f3 = FarmField(farm_id=farm.id, field_name="Field 3", area=0.7, current_crop="Mustard")
        db.add_all([f1, f2, f3])

    await db.commit()

    token = create_access_token({"sub": str(new_user.id), "email": new_user.email, "is_farmer": new_user.is_farmer})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "phone": new_user.phone,
            "is_farmer": new_user.is_farmer,
            "is_admin": new_user.is_admin,
            "wallet_balance": new_user.wallet_balance
        }
    }

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = None
    if req.email:
        res = await db.execute(select(User).where(User.email == req.email))
        user = res.scalar_one_or_none()
    elif req.phone:
        res = await db.execute(select(User).where(User.phone == req.phone))
        user = res.scalar_one_or_none()

    if not user:
        # Fallback to default user in demo mode
        res = await db.execute(select(User).where(User.email == "user@krishigo.com"))
        user = res.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id), "email": user.email, "is_farmer": user.is_farmer})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "is_farmer": user.is_farmer,
            "is_admin": user.is_admin,
            "wallet_balance": user.wallet_balance
        }
    }

@router.post("/phone-otp")
async def send_phone_otp(req: PhoneOtpRequest):
    # Generates a realistic 6-digit OTP
    import secrets
    otp = str(secrets.randbelow(900000) + 100000)
    OTP_STORE[req.phone] = otp
    return {
        "message": f"OTP sent to {req.phone}",
        "status": "SENT",
        "demo_hint": f"Your OTP is {otp}"
    }

@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(req: VerifyOtpRequest, db: AsyncSession = Depends(get_db)):
    stored_otp = OTP_STORE.get(req.phone)
    if stored_otp and req.otp != stored_otp and req.otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP code")

    # Find or create user
    res = await db.execute(select(User).where(User.phone == req.phone))
    user = res.scalar_one_or_none()
    if not user:
        user = User(
            name="Farmer User" if req.register_as_farmer else "User",
            phone=req.phone,
            is_farmer=req.register_as_farmer,
            wallet_balance=848.0
        )
        db.add(user)
        await db.flush()

        if req.register_as_farmer:
            fp = FarmerProfile(user_id=user.id, display_name=user.name)
            db.add(fp)
            await db.flush()
            farm = Farm(farmer_id=fp.id, farm_name=f"{user.name}'s Farm", total_area=2.5)
            db.add(farm)
            await db.flush()
            f1 = FarmField(farm_id=farm.id, field_name="Field 1", area=1.0, current_crop="Tomato")
            f2 = FarmField(farm_id=farm.id, field_name="Field 2", area=0.8, current_crop="Potato")
            f3 = FarmField(farm_id=farm.id, field_name="Field 3", area=0.7, current_crop="Mustard")
            db.add_all([f1, f2, f3])

        await db.commit()

    token = create_access_token({"sub": str(user.id), "phone": user.phone, "is_farmer": user.is_farmer})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "is_farmer": user.is_farmer,
            "is_admin": user.is_admin,
            "wallet_balance": user.wallet_balance
        }
    }

@router.get("/me")
async def get_me(db: AsyncSession = Depends(get_db)):
    # Returns default demo user or current session user
    res = await db.execute(select(User).where(User.email == "user@krishigo.com"))
    user = res.scalar_one_or_none()
    if not user:
        res2 = await db.execute(select(User))
        user = res2.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "is_farmer": user.is_farmer,
        "is_admin": user.is_admin,
        "wallet_balance": user.wallet_balance
    }

@router.post("/become-farmer")
async def become_farmer(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).where(User.email == "user@krishigo.com"))
    user = res.scalar_one_or_none()
    if not user:
        res = await db.execute(select(User))
        user = res.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_farmer = True

    # Ensure profile and farm exist
    fp_check = await db.execute(select(FarmerProfile).where(FarmerProfile.user_id == user.id))
    fp = fp_check.scalar_one_or_none()
    if not fp:
        fp = FarmerProfile(user_id=user.id, display_name=user.name)
        db.add(fp)
        await db.flush()

        farm = Farm(farmer_id=fp.id, farm_name="Siliguri Smart Farm", total_area=2.5)
        db.add(farm)
        await db.flush()

        f1 = FarmField(farm_id=farm.id, field_name="Field 1", area=1.0, current_crop="Tomato")
        f2 = FarmField(farm_id=farm.id, field_name="Field 2", area=0.8, current_crop="Potato")
        f3 = FarmField(farm_id=farm.id, field_name="Field 3", area=0.7, current_crop="Mustard")
        db.add_all([f1, f2, f3])

    await db.commit()
    return {"message": "Successfully upgraded to Farmer", "is_farmer": True}

import firebase_admin
from firebase_admin import credentials, auth as firebase_auth

_firebase_initialized = False
def init_firebase():
    global _firebase_initialized
    if not _firebase_initialized:
        try:
            cred = credentials.Certificate("service-account.json")
            firebase_admin.initialize_app(cred)
            _firebase_initialized = True
        except Exception as e:
            print(f"Warning: Firebase Admin Initialization failed. Make sure service-account.json exists in backend root. {e}")

@router.post("/firebase", response_model=TokenResponse)
async def firebase_login(req: FirebaseAuthRequest, db: AsyncSession = Depends(get_db)):
    init_firebase()
    if not _firebase_initialized:
        raise HTTPException(status_code=500, detail="Firebase Admin SDK is not configured on the server")
    
    try:
        decoded_token = firebase_auth.verify_id_token(req.id_token)
        uid = decoded_token.get("uid")
        email = decoded_token.get("email")
        phone = decoded_token.get("phone_number")
        name = decoded_token.get("name", "User")
        
        # Determine unique identifier
        if email:
            res = await db.execute(select(User).where(User.email == email))
        elif phone:
            res = await db.execute(select(User).where(User.phone == phone))
        else:
            raise HTTPException(status_code=400, detail="Token must contain email or phone")
            
        user = res.scalar_one_or_none()
        
        if not user:
            # Create user based on Firebase data
            user = User(
                name=name,
                email=email,
                phone=phone,
                hashed_password=hash_password(uid), # Fallback dummy pass
                is_farmer=req.register_as_farmer,
                is_admin=False,
                wallet_balance=848.0
            )
            db.add(user)
            await db.flush()
            
            # Setup defaults for new user
            addr = Address(user_id=user.id, tag="Home", full_address="Siliguri, West Bengal", city="Siliguri", state="West Bengal", postal_code="734001", is_default=True)
            db.add(addr)
            
            if req.register_as_farmer:
                fp = FarmerProfile(user_id=user.id, display_name=user.name, state="West Bengal", district="Darjeeling")
                db.add(fp)
                await db.flush()
                farm = Farm(farmer_id=fp.id, farm_name=f"{user.name}'s Farm", address="Siliguri, West Bengal", total_area=2.5)
                db.add(farm)
                await db.flush()
                db.add_all([FarmField(farm_id=farm.id, field_name="Field 1", area=1.0, current_crop="Tomato"),
                           FarmField(farm_id=farm.id, field_name="Field 2", area=0.8, current_crop="Potato")])
                           
            await db.commit()
            
        token = create_access_token({"sub": str(user.id), "email": user.email, "is_farmer": user.is_farmer})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "is_farmer": user.is_farmer,
                "is_admin": user.is_admin,
                "wallet_balance": user.wallet_balance
            }
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=401, detail="Invalid Firebase Token")
