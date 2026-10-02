# KrishiGo — Payments & Wallet API

## Overview

KrishiGo supports multi-channel payment processing designed for Indian rural and urban commerce environments.

---

## Supported Payment Methods

1. **Cash on Delivery (COD)**: Cash collected upon delivery by courier agents.
2. **KrishiGo In-App Wallet**: Instant closed-loop digital balance with loyalty cashbacks.
3. **UPI / QR Code**: Direct UPI intent or dynamic QR code.
4. **Debit / Credit Cards**: Standard netbanking and card payment workflows.

---

## Wallet & Payment Endpoints

### 1. Retrieve Wallet Balance
- **Method**: `GET`
- **Path**: `/api/v1/commerce/wallet`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "balance": 450.00,
  "currency": "INR",
  "cashback_pending": 25.00,
  "recent_transactions": [
    {
      "id": 101,
      "type": "CREDIT",
      "amount": 500.00,
      "description": "UPI Top-up",
      "timestamp": "2026-10-02T14:30:00Z"
    },
    {
      "id": 102,
      "type": "DEBIT",
      "amount": 50.00,
      "description": "Order #KG-9842 Discount",
      "timestamp": "2026-10-02T16:15:00Z"
    }
  ]
}
```

### 2. Top-Up Wallet
- **Method**: `POST`
- **Path**: `/api/v1/commerce/wallet/topup`
- **Request Body**: `{ "amount": 500 }`

### 3. Create Checkout Order
- **Method**: `POST`
- **Path**: `/api/v1/commerce/orders`
- **Request Body**:
```json
{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 5, "quantity": 1 }
  ],
  "delivery_address_id": 1,
  "payment_method": "WALLET",
  "coupon_code": "FRESHFARM10"
}
```
- **Response**: Complete Order confirmation object with estimated delivery time.
