from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from decimal import Decimal
from app.repositories.base import BaseRepository
from app.models.order import Payment, Order, PaymentStatus, OrderStatus
from app.utils.exceptions import NotFoundException, PaymentFailedException

class PaymentService:
    def __init__(self):
        self.payment_repo = BaseRepository(Payment)
        self.order_repo = BaseRepository(Order)
        
    async def process_payment(self, db: AsyncSession, order_id: UUID, method: str, amount: Decimal) -> Payment:
        order = await self.order_repo.get_by_id(db, order_id)
        if not order:
            raise NotFoundException("Order not found")
            
        # Always succeeds in demo mode
        payment = Payment(
            order_id=order_id,
            method=method,
            amount=amount,
            status=PaymentStatus.COMPLETED,
            transaction_id="TXN-DEMO-123456",
            provider_response="Success"
        )
        db.add(payment)
        
        order.payment_status = PaymentStatus.COMPLETED
        if order.status == OrderStatus.ORDER_PLACED:
            order.status = OrderStatus.CONFIRMED
            
        await db.commit()
        await db.refresh(payment)
        return payment
