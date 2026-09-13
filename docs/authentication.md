# KrishiGo Authentication

## Overview

KrishiGo uses JWT-based authentication with role-based access control (RBAC).

## Flow

### Registration
1. User submits: email, phone, full_name, password, role (CUSTOMER/FARMER)
2. Backend validates input, checks email uniqueness
3. Password hashed with bcrypt
4. User created with selected role
5. JWT access token + refresh token returned

### Login
1. User submits: email, password
2. Backend verifies credentials
3. JWT access token (30 min) + refresh token (7 days) returned

### Token Refresh
1. Client sends expired access token + valid refresh token
2. Backend validates refresh token
3. New access token issued

### Protected Routes
1. Client includes `Authorization: Bearer <token>` header
2. Backend validates token, extracts user ID and role
3. RBAC check against required role for endpoint

## JWT Structure

### Access Token
```json
{
  "sub": "user-uuid",
  "role": "CUSTOMER",
  "exp": 1234567890,
  "type": "access"
}
```

### Refresh Token
```json
{
  "sub": "user-uuid",
  "exp": 1234567890,
  "type": "refresh"
}
```

## RBAC Matrix

| Resource | CUSTOMER | FARMER | DELIVERY | WAREHOUSE | PROCUREMENT | ADMIN | SUPER_ADMIN |
|----------|----------|--------|----------|-----------|-------------|-------|-------------|
| Products (read) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Products (write) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Cart | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Orders (own) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Orders (all) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Farmer Portal | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Warehouse | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Procurement | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Delivery | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Admin | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Settings | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT signed with HS256
- Access tokens expire in 30 minutes
- Refresh tokens expire in 7 days
- CORS configured for frontend origin only
- Rate limiting on auth endpoints
- Audit logging for login/logout events
