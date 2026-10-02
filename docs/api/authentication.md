# KrishiGo — Authentication & Identity API

## Architecture

KrishiGo supports dual authentication mechanisms:
1. **Firebase Authentication**: Manages consumer phone number OTPs, social logins, and client identity.
2. **Backend JWT Sessions**: FastAPI validates Firebase tokens or issues signed JWTs for session continuity and role authorization (`role: "consumer" | "farmer" | "admin"`).

---

## Authentication Endpoints

### 1. Register / Onboard User
- **Method**: `POST`
- **Path**: `/api/v1/auth/register`
- **Request Body**:
```json
{
  "email": "farmer@krishigo.com",
  "phone": "+919876543210",
  "name": "Ramesh Kumar",
  "role": "farmer",
  "firebase_uid": "optional_firebase_uid"
}
```
- **Response**: User record with generated session token.

### 2. Login
- **Method**: `POST`
- **Path**: `/api/v1/auth/login`
- **Request Body**:
```json
{
  "phone_or_email": "+919876543210",
  "password": "secure_password"
}
```
- **Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Ramesh Kumar",
    "role": "farmer"
  }
}
```

### 3. Current User Profile
- **Method**: `GET`
- **Path**: `/api/v1/auth/me`
- **Headers**: `Authorization: Bearer <access_token>`

### 4. Switch Persona (Consumer ↔ Farmer)
- **Method**: `POST`
- **Path**: `/api/v1/auth/become-farmer`
- **Description**: Prompts existing consumers to register farm acreage and coordinates, granting instantaneous access to `/farmer`.
