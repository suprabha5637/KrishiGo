import asyncio
from app.database.session import async_session_maker
from app.models.user import User, UserRole
from app.core.security import hash_password
from app.models.product import Category, Product, ProductVariant, QualityGrade
from decimal import Decimal

async def seed_data():
    async with async_session_maker() as db:
        # Create super admin
        admin = User(
            email="admin@krishigo.com",
            phone="+919876543210",
            full_name="KrishiGo Admin",
            password_hash=hash_password("admin123"),
            role=UserRole.SUPER_ADMIN,
            is_active=True,
            is_verified=True
        )
        db.add(admin)
        
        # Add basic categories
        veg = Category(name="Vegetables", slug="vegetables", description="Fresh vegetables")
        db.add(veg)
        
        fruits = Category(name="Fruits", slug="fruits", description="Fresh fruits")
        db.add(fruits)
        
        await db.commit()
        
        # Add a product
        tomato = Product(
            name="Tomato",
            slug="tomato",
            sku="VEG-TOM-001",
            category_id=veg.id,
            base_price=Decimal("40.00"),
            unit="kg"
        )
        db.add(tomato)
        await db.commit()
        await db.refresh(tomato)
        
        # Add variant
        variant = ProductVariant(
            product_id=tomato.id,
            quality_grade=QualityGrade.PREMIUM,
            price=Decimal("45.00"),
            stock_quantity=Decimal("100.00")
        )
        db.add(variant)
        await db.commit()

        print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
