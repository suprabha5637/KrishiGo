# KrishiGo Business Logic

## Core Business Model

```
Farmers → Suppliers/Dealers → KrishiGo Procurement → Quality Inspection
→ Warehouse/Dark Store → Inventory → Customer Orders → Picking → Packing
→ Delivery → Customer
```

## Important Business Rules

### 1. No Harvest-on-Order
- Farmers must NOT be forced to harvest because a customer placed an order
- Harvest prediction is **advisory only**
- Customer orders are fulfilled from existing warehouse inventory
- The platform provides estimated maturity dates, harvest windows, and demand signals

### 2. Food Safety
- "Value" grade never means unsafe, spoiled, or expired
- All products must pass quality inspection before entering inventory
- Rejected products never enter sellable inventory
- Expired/spoiled products are flagged and removed

### 3. Delivery Promises
- Never promise "15-minute delivery" universally
- Use: "15-minute delivery on eligible products and service areas"
- Delivery time calculated dynamically based on distance, inventory, capacity

## Order Lifecycle

### Quick Commerce Orders
```
ORDER_PLACED → CONFIRMED → INVENTORY_RESERVED → PICKING
→ PACKED → OUT_FOR_DELIVERY → DELIVERED
```
Alternative: `CANCELLED`, `REFUNDED`

### Bulk Orders
```
REQUESTED → UNDER_REVIEW → MATCHING → QUOTED
→ CUSTOMER_ACCEPTED → SCHEDULED → FULFILLING → DELIVERED → COMPLETED
```

## Inventory Management

### Stock Types
- **Physical Stock** — Total stock in warehouse
- **Reserved Stock** — Held for confirmed orders
- **Available Stock** — Physical - Reserved - Unavailable
- **Damaged Stock** — Failed inspection
- **In-Transit Stock** — Being delivered

### Formula
```
available_stock = physical_stock - reserved_stock - unavailable_stock
```
Available stock can NEVER be negative.

### Concurrency
- Two customers cannot reserve the same final unit simultaneously
- Uses database transactions with row-level locking (`SELECT FOR UPDATE`)

## Quality Grades

| Grade | Description | Price Level |
|-------|-------------|-------------|
| Premium | Best appearance, best quality | Highest |
| Standard | Good quality, normal appearance | Normal |
| Value | Economical, safe, may have cosmetic imperfections | Lowest |

## Pricing

- All prices in INR (₹)
- Money stored as `Numeric(12, 2)` — never Float
- Each product variant (quality grade) has its own price
- Bulk orders may have negotiated pricing

## Farmer Earnings

```
Farmer declares produce → Procurement accepts → Pickup scheduled
→ Warehouse receives → Quality inspection → Grading → Batch created
→ Added to inventory → Farmer receives settlement
```

Settlement happens after configured conditions are met (e.g., quality verification, batch acceptance).

## Unit Economics

```
Contribution Profit/Order =
  Revenue
  + Service Fees
  - Procurement Cost
  - Picking/Packing Cost
  - Delivery Cost
  - Payment Processing Cost
  - Expected Wastage/Returns
  - Other Variable Costs
```
