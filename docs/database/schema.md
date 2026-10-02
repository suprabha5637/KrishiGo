# KrishiGo — Database Schema Reference

## Database Engine
- **Development**: SQLite (`krishigo.db` in project root)
- **Production**: PostgreSQL 16+ via SQLAlchemy Async Engine (`postgresql+asyncpg://...`)

---

## Detailed Table Specifications

### 1. `categories`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing identifier |
| `name` | VARCHAR(100) | NOT NULL | Category display name |
| `slug` | VARCHAR(100) | UNIQUE, INDEX | URL-friendly slug (e.g. `fresh-vegetables`) |
| `description` | TEXT | NULLABLE | Category marketing description |
| `image_url` | VARCHAR(255) | NULLABLE | Asset path or CDN URL |
| `order_index` | INTEGER | DEFAULT 0 | Ordering index for category ribbon & sidebar |

### 2. `products`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY | Unique product ID |
| `name` | VARCHAR(255) | NOT NULL | Product name |
| `slug` | VARCHAR(255) | UNIQUE, INDEX | URL slug |
| `category_id` | INTEGER | FOREIGN KEY | References `categories.id` |
| `unit` | VARCHAR(50) | NOT NULL | Unit packaging (e.g. `1 kg`, `500 g`, `1 bunch`) |
| `price` | NUMERIC(10,2)| NOT NULL | Selling price in INR (₹) |
| `original_price`| NUMERIC(10,2)| NOT NULL | MRP / pre-discount price |
| `discount_pct` | INTEGER | DEFAULT 0 | Percentage savings |
| `stock` | INTEGER | DEFAULT 50 | Available inventory |
| `image_url` | VARCHAR(255) | NOT NULL | Local asset path or image CDN |
| `is_organic` | BOOLEAN | DEFAULT FALSE| Organic certification flag |
| `farm_origin` | VARCHAR(100) | NULLABLE | Source farm / village |
| `rating` | NUMERIC(3,2)| DEFAULT 4.8 | Consumer satisfaction rating (1.00 - 5.00) |
| `reviews_count` | INTEGER | DEFAULT 120 | Count of ratings |

### 3. `orders`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY | Unique order number |
| `order_number` | VARCHAR(50) | UNIQUE | Formatted display ID (e.g. `KG-20261002-8491`) |
| `user_id` | INTEGER | FOREIGN KEY | References `users.id` |
| `status` | VARCHAR(50) | NOT NULL | `PENDING`, `CONFIRMED`, `DELIVERED`, etc. |
| `total_amount` | NUMERIC(10,2)| NOT NULL | Final invoice total |
| `payment_method`| VARCHAR(50) | NOT NULL | `COD`, `WALLET`, `UPI`, `CARD` |
| `payment_status`| VARCHAR(50) | NOT NULL | `PAID`, `PENDING`, `FAILED` |
| `delivery_slot` | VARCHAR(100) | NOT NULL | Selected delivery window |
| `created_at` | TIMESTAMP | DEFAULT NOW | Order creation timestamp |

### 4. `farms`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY | Unique farm ID |
| `farmer_id` | INTEGER | FOREIGN KEY | References `users.id` |
| `name` | VARCHAR(100) | NOT NULL | Farm title (e.g. `Green Valley Agro Field`) |
| `latitude` | NUMERIC(10,7)| NOT NULL | Geolocation coordinate |
| `longitude` | NUMERIC(10,7)| NOT NULL | Geolocation coordinate |
| `total_acres` | NUMERIC(6,2) | NOT NULL | Total land acreage |
| `soil_type` | VARCHAR(50) | NOT NULL | `Alluvial`, `Black Cotton`, `Loamy`, `Red` |
| `primary_crop` | VARCHAR(100) | NOT NULL | Main harvest focus |
