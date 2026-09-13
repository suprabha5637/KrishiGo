from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from fastapi import HTTPException
from datetime import datetime

from app.models.warehouse import InventoryBatch, QualityInspection
from app.models.order import Order, OrderStatus
from app.schemas.warehouse import InventoryBatchCreate, QualityInspectionCreate

class WarehouseService:
    async def receive_batch(self, db: AsyncSession, batch_in: InventoryBatchCreate):
        batch = InventoryBatch(**batch_in.model_dump())
        db.add(batch)
        await db.commit()
        await db.refresh(batch)
        return batch

    async def create_quality_inspection(self, db: AsyncSession, inspector_id: UUID, inspection_in: QualityInspectionCreate):
        # Verify batch exists
        stmt = select(InventoryBatch).where(InventoryBatch.id == inspection_in.batch_id)
        result = await db.execute(stmt)
        batch = result.scalars().first()
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")

        inspection = QualityInspection(
            inspector_id=inspector_id,
            **inspection_in.model_dump()
        )
        db.add(inspection)
        
        # Update batch inspection info
        batch.quality_grade = inspection_in.quality_grade
        batch.inspection_result = "ACCEPTED" if inspection_in.is_accepted else "REJECTED"
        if inspection_in.is_accepted:
            batch.accepted_qty = inspection_in.weight_kg
            batch.rejected_qty = batch.received_qty - inspection_in.weight_kg
        else:
            batch.accepted_qty = 0
            batch.rejected_qty = batch.received_qty
            
        await db.commit()
        await db.refresh(inspection)
        return inspection

    async def update_order_fulfillment(self, db: AsyncSession, order_id: UUID, status: str):
        stmt = select(Order).where(Order.id == order_id)
        result = await db.execute(stmt)
        order = result.scalars().first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        try:
            order.status = OrderStatus(status)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid order status")

        await db.commit()
        await db.refresh(order)
        return order

warehouse_service = WarehouseService()
