# KrishiGo Testing Guide

## Test Strategy

### Backend (pytest)
```bash
cd backend
pytest                    # Run all tests
pytest -v                 # Verbose output
pytest tests/test_auth.py # Specific test file
pytest --cov=app          # With coverage
```

### Frontend (Jest + React Testing Library)
```bash
cd frontend
npm test                  # Run all tests
npm test -- --watch       # Watch mode
npm test -- --coverage    # With coverage
```

## Test Categories

### Unit Tests
- Service layer business logic
- Utility functions
- Component rendering
- Form validation

### Integration Tests
- API endpoint tests with test database
- Database model relationships
- Authentication flow

### E2E Test Flow
1. Register customer
2. Login
3. Browse products
4. Search "tomato"
5. Open product detail
6. Select Standard quality
7. Add 2 kg to cart
8. View cart
9. Checkout (select address, delivery, payment)
10. Place order
11. Verify order created
12. Verify inventory reduced
13. Verify warehouse task created
14. Verify delivery assignment
15. Complete delivery (OTP)
16. Verify order status = DELIVERED

### Critical Test Scenarios
- Inventory race conditions (concurrent order placement)
- Payment failure handling
- Order cancellation with inventory release
- Refund processing
- Insufficient inventory at checkout
- Role-based access control enforcement
- JWT expiration and refresh
