# KrishiGo API Reference

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

All authenticated endpoints require a Bearer token:
```
Authorization: Bearer <access_token>
```

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

## Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login | No |
| POST | `/auth/refresh` | Refresh token | No |
| POST | `/auth/logout` | Logout | Yes |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password | No |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products` | List products (with filters) | No |
| GET | `/products/{slug}` | Get product detail | No |
| POST | `/products` | Create product | Admin |
| PUT | `/products/{id}` | Update product | Admin |
| DELETE | `/products/{id}` | Delete product | Admin |

### Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/categories` | List categories | No |
| GET | `/categories/{slug}` | Category detail | No |
| GET | `/categories/{slug}/products` | Products by category | No |

### Cart

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/cart` | Get cart | Yes |
| POST | `/cart/items` | Add item | Yes |
| PUT | `/cart/items/{id}` | Update item quantity | Yes |
| DELETE | `/cart/items/{id}` | Remove item | Yes |

### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/orders` | Place order | Yes |
| GET | `/orders` | List orders | Yes |
| GET | `/orders/{id}` | Order detail | Yes |
| POST | `/orders/{id}/cancel` | Cancel order | Yes |

### Search

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/search?q=&category=&quality=&organic=&sort=` | Search products | No |

### Wishlist

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/wishlist` | Get wishlist | Yes |
| POST | `/wishlist` | Add to wishlist | Yes |
| DELETE | `/wishlist/{product_id}` | Remove from wishlist | Yes |

### Addresses

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/addresses` | List addresses | Yes |
| POST | `/addresses` | Create address | Yes |
| PUT | `/addresses/{id}` | Update address | Yes |
| DELETE | `/addresses/{id}` | Delete address | Yes |

### Bulk Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/bulk-orders` | Create bulk request | Yes |
| GET | `/bulk-orders` | List bulk orders | Yes |
| GET | `/bulk-orders/{id}` | Bulk order detail | Yes |
| POST | `/bulk-orders/{id}/accept-quote` | Accept quotation | Yes |

### Farmers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/farmers/me` | Farmer profile | Farmer |
| PUT | `/farmers/me` | Update profile | Farmer |
| GET | `/farmers/crops` | List crops | Farmer |
| POST | `/farmers/crops` | Add crop | Farmer |
| POST | `/farmers/sell` | Declare produce | Farmer |
| GET | `/farmers/earnings` | View earnings | Farmer |

### Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/dashboard` | Dashboard stats | Admin |
| GET | `/admin/users` | User management | Admin |
| GET | `/admin/analytics/*` | Analytics | Admin |

### Health

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Health check | No |
| GET | `/ready` | Readiness check | No |

## Pagination

```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "page_size": 20,
  "pages": 5
}
```

## Interactive API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
