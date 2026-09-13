from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from uuid import UUID
from fastapi import HTTPException
from datetime import datetime

from app.models.farmer import Farmer
from app.models.order import Order, OrderItem
from app.models.product import Product

class AdminService:
    async def get_revenue_analytics(self, db: AsyncSession):
        # Calculate total revenue and group by date (simple approach)
        stmt = (
            select(
                func.date(Order.created_at).label("date"),
                func.sum(Order.total_amount).label("revenue")
            )
            .group_by(func.date(Order.created_at))
            .order_by(func.date(Order.created_at))
        )
        result = await db.execute(stmt)
        rows = result.all()
        return [{"date": row.date, "revenue": float(row.revenue or 0)} for row in rows]

    async def get_top_selling_products(self, db: AsyncSession, limit: int = 10):
        # Top products by total quantity sold
        stmt = (
            select(
                Product.name,
                func.sum(OrderItem.quantity).label("total_sold")
            )
            .join(OrderItem, OrderItem.product_id == Product.id)
            .group_by(Product.name)
            .order_by(desc("total_sold"))
            .limit(limit)
        )
        result = await db.execute(stmt)
        rows = result.all()
        return [{"product_name": row.name, "total_sold": float(row.total_sold or 0)} for row in rows]

    async def verify_farmer(self, db: AsyncSession, farmer_id: UUID, status: str = "VERIFIED"):
        stmt = select(Farmer).where(Farmer.id == farmer_id)
        result = await db.execute(stmt)
        farmer = result.scalars().first()
        if not farmer:
            raise HTTPException(status_code=404, detail="Farmer not found")
        
        farmer.verification_status = status
        await db.commit()
        await db.refresh(farmer)
        return farmer

admin_service = AdminService()
