from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from fastapi import HTTPException
from datetime import datetime, timedelta
from decimal import Decimal

from app.models.bulk import BulkRequest, BulkMatch, BulkQuote, BulkStatus
from app.models.farmer import FarmerCrop
from app.schemas.bulk import BulkRequestCreate

class BulkService:
    async def create_bulk_request(self, db: AsyncSession, customer_id: UUID, request_in: BulkRequestCreate):
        bulk_req = BulkRequest(
            customer_id=customer_id,
            status=BulkStatus.REQUESTED,
            **request_in.model_dump()
        )
        db.add(bulk_req)
        await db.commit()
        await db.refresh(bulk_req)
        return bulk_req

    async def run_matching_algorithm(self, db: AsyncSession, request_id: UUID):
        stmt = select(BulkRequest).where(BulkRequest.id == request_id)
        result = await db.execute(stmt)
        bulk_req = result.scalars().first()
        if not bulk_req:
            raise HTTPException(status_code=404, detail="Bulk request not found")
            
        bulk_req.status = BulkStatus.MATCHING
        
        # Simple match: find farmers with crops matching the product name (this is a simplified example, in real-world we'd match with BulkItem)
        # Assuming BulkRequest doesn't have items explicitly populated in this simplified example
        # But we'll just mock a match for demonstration
        
        # Fetch some crops to match
        stmt = select(FarmerCrop).limit(5)
        crops = (await db.execute(stmt)).scalars().all()
        
        matches = []
        for crop in crops:
            match = BulkMatch(
                request_id=request_id,
                farmer_id=crop.farmer_id,
                product_name=crop.crop_name,
                available_qty=crop.area_acres * Decimal(1000), # dummy calculation
                price_per_unit=Decimal(50.0), # dummy price
                distance_km=10.0
            )
            db.add(match)
            matches.append(match)
            
        bulk_req.status = BulkStatus.UNDER_REVIEW
        await db.commit()
        return matches

    async def generate_quote(self, db: AsyncSession, request_id: UUID):
        # Fetch matches
        stmt = select(BulkMatch).where(BulkMatch.request_id == request_id)
        matches = (await db.execute(stmt)).scalars().all()
        
        if not matches:
            raise HTTPException(status_code=400, detail="No matches found to generate a quote")
            
        subtotal = sum(m.available_qty * m.price_per_unit for m in matches)
        service_fee = subtotal * Decimal('0.05')
        logistics_fee = Decimal('500.00')
        total = subtotal + service_fee + logistics_fee
        
        quote = BulkQuote(
            request_id=request_id,
            subtotal=subtotal,
            service_fee=service_fee,
            logistics_fee=logistics_fee,
            total=total,
            valid_until=datetime.utcnow() + timedelta(days=7),
            status="GENERATED"
        )
        db.add(quote)
        
        # Update request status
        stmt = select(BulkRequest).where(BulkRequest.id == request_id)
        bulk_req = (await db.execute(stmt)).scalars().first()
        if bulk_req:
            bulk_req.status = BulkStatus.QUOTED
            
        await db.commit()
        await db.refresh(quote)
        return quote

bulk_service = BulkService()
