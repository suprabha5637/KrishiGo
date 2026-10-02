import asyncio
import random
import datetime
from sqlalchemy import select
from backend.app.core.database import AsyncSessionLocal, engine, Base
from backend.app.core.security import hash_password
from backend.app.models.all_models import (
    User, Category, Product, Address, FarmerProfile, Farm, FarmField,
    FarmTask, FarmExpense, FarmIncome, MarketPriceRecord, ServiceProvider,
    GovernmentScheme, CCTVCamera, WalletTransaction
)

CATEGORIES = [
    {"name": "Fresh Vegetables", "slug": "fresh-vegetables", "description": "Handpicked fresh vegetables directly from farms", "order_index": 1},
    {"name": "Fresh Fruits", "slug": "fresh-fruits", "description": "Seasonal and organic fresh fruits", "order_index": 2},
    {"name": "Dairy & Milk", "slug": "dairy-milk", "description": "Fresh milk, paneer, ghee and dairy products", "order_index": 3},
    {"name": "Grocery & Staples", "slug": "grocery-staples", "description": "Atta, rice, dal, spices and pantry essentials", "order_index": 4},
    {"name": "Snacks & Beverages", "slug": "snacks-beverages", "description": "Healthy juices, tea, coffee and munchies", "order_index": 5},
    {"name": "Meat, Egg & Seafood", "slug": "meat-egg-seafood", "description": "Fresh farm eggs, poultry and seafood", "order_index": 6},
    {"name": "Bakery & Sweets", "slug": "bakery-sweets", "description": "Artisanal breads, cookies and traditional sweets", "order_index": 7},
    {"name": "Personal Care", "slug": "personal-care", "description": "Organic soaps, natural shampoos and hygiene", "order_index": 8},
    {"name": "Home Essentials", "slug": "home-essentials", "description": "Eco-friendly cleaners, laundry and kitchen essentials", "order_index": 9},
    {"name": "Seeds & Fertilizers", "slug": "seeds-fertilizers", "description": "Certified seeds, organic manure and bio-fertilizers", "order_index": 10},
    {"name": "Farm Tools", "slug": "farm-tools", "description": "High-durability trowels, pruning shears, sprayers and tillers", "order_index": 11},
    {"name": "Organic Products", "slug": "organic-products", "description": "100% certified organic farm produce", "order_index": 12},
    {"name": "Study Essentials", "slug": "study-essentials", "description": "Notebooks, pen sets, textbooks and school bags", "order_index": 13},
    {"name": "Clothing & Fashion", "slug": "clothing-fashion", "description": "Cotton t-shirts, kurtis, kids wear and sarees", "order_index": 14},
    {"name": "Pharmacy & Health", "slug": "pharmacy-health", "description": "Vitamins, pain relief, face masks, sanitizers and first aid", "order_index": 15},
    {"name": "Beauty & Wellness", "slug": "beauty-wellness", "description": "Herbal skincare, essential oils and wellness supplements", "order_index": 16},
    {"name": "Baby Care", "slug": "baby-care", "description": "Baby wipes, organic baby food and soft care", "order_index": 17},
    {"name": "Pet Care", "slug": "pet-care", "description": "Nutritious pet food, treats and grooming supplies", "order_index": 18},
    {"name": "Offers & Deals", "slug": "offers-deals", "description": "Special discounts and bundle promotions", "order_index": 19},
]

# Base product templates to expand deterministically to 10,000+ items
PRODUCT_TEMPLATES = {
    "fresh-vegetables": [
        ("Tomato", "1 kg", 18.0, 30.0, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400"),
        ("Potato", "1 kg", 16.0, 26.0, "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400"),
        ("Onion", "1 kg", 20.0, 32.0, "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400"),
        ("Carrot", "500 g", 24.0, 40.0, "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400"),
        ("Capsicum", "500 g", 28.0, 45.0, "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400"),
        ("Spinach (Palak)", "250 g", 12.0, 30.0, "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400"),
        ("Cauliflower", "1 pc", 28.0, 45.0, "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400"),
        ("Brinjal", "500 g", 18.0, 30.0, "https://images.unsplash.com/photo-1628773822503-930a84d943ef?w=400"),
        ("Green Chili", "200 g", 15.0, 25.0, "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400"),
        ("Cabbage", "1 pc", 22.0, 35.0, "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400"),
        ("Ginger (Adrak)", "250 g", 35.0, 50.0, "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400"),
        ("Garlic (Lahsun)", "250 g", 45.0, 65.0, "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400"),
        ("Bitter Gourd (Karela)", "500 g", 26.0, 40.0, "https://images.unsplash.com/photo-1628773822503-930a84d943ef?w=400"),
        ("Bottle Gourd (Lauki)", "1 pc", 25.0, 38.0, "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400"),
        ("Cucumber", "500 g", 20.0, 30.0, "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400")
    ],
    "fresh-fruits": [
        ("Shimla Apple", "1 kg", 140.0, 180.0, "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400"),
        ("Robusta Banana", "1 dozen", 48.0, 65.0, "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400"),
        ("Nagpur Orange", "1 kg", 75.0, 100.0, "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400"),
        ("Pomegranate (Anar)", "500 g", 95.0, 130.0, "https://images.unsplash.com/photo-1541344999736-83eca872f240?w=400"),
        ("Papaya", "1 pc (approx 1 kg)", 45.0, 60.0, "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400"),
        ("Alphonso Mango", "1 kg", 280.0, 360.0, "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400"),
        ("Green Grapes", "500 g", 65.0, 90.0, "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400"),
        ("Watermelon", "1 pc (approx 2.5 kg)", 60.0, 85.0, "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400")
    ],
    "dairy-milk": [
        ("Farm Fresh Cow Milk", "1 L", 56.0, 64.0, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400"),
        ("Organic Desi Cow Ghee", "500 ml", 480.0, 550.0, "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=400"),
        ("Fresh Malai Paneer", "200 g", 85.0, 105.0, "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=400"),
        ("Artisanal Set Dahi (Curd)", "400 g", 35.0, 42.0, "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400"),
        ("Salted Farm Butter", "100 g", 52.0, 60.0, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400")
    ],
    "grocery-staples": [
        ("Organic Chakki Whole Wheat Atta", "5 kg", 220.0, 260.0, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"),
        ("Sona Masoori Raw Rice", "5 kg", 310.0, 380.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"),
        ("Unpolished Toor Dal", "1 kg", 145.0, 175.0, "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400"),
        ("Cold Pressed Mustard Oil", "1 L", 160.0, 195.0, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400"),
        ("Raw Organic Honey", "500 g", 260.0, 320.0, "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=400")
    ],
    "study-essentials": [
        ("Notebook", "1 pc (180 pages)", 40.0, 55.0, "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"),
        ("Pen Set", "Pack of 5", 99.0, 150.0, "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400"),
        ("School Bag", "1 pc", 499.0, 799.0, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"),
        ("Textbooks", "Set of 3", 299.0, 450.0, "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400"),
        ("Calculator", "1 pc", 499.0, 699.0, "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400"),
        ("Study Table", "Foldable Wood", 2999.0, 3999.0, "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400")
    ],
    "clothing-fashion": [
        ("Men T-Shirt", "100% Pure Cotton", 399.0, 699.0, "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400"),
        ("Women Kurti", "Floral Embroidered", 699.0, 1199.0, "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400"),
        ("Kids Wear", "Comfortable Cotton Set", 499.0, 899.0, "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400"),
        ("Sports Shoes", "Breathable Mesh", 1299.0, 2199.0, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"),
        ("Jeans", "Slim Fit Denim", 899.0, 1499.0, "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400"),
        ("Saree", "Traditional Handloom", 999.0, 1899.0, "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400")
    ],
    "pharmacy-health": [
        ("Vitamin D", "60 Tablets", 400.0, 550.0, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400"),
        ("Pain Relief", "Ayurvedic Balm 50g", 99.0, 140.0, "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400"),
        ("Face Mask", "Pack of 10 N95", 149.0, 249.0, "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400"),
        ("Sanitizer", "500 ml Dispenser", 99.0, 150.0, "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400"),
        ("Thermometer", "Digital Infrared", 249.0, 450.0, "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400"),
        ("First Aid Kit", "Comprehensive Home Box", 499.0, 799.0, "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400")
    ],
    "seeds-fertilizers": [
        ("Hybrid Tomato Seeds (Pusa Ruby)", "100 g", 120.0, 160.0, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400"),
        ("Organic Vermicompost Manure", "5 kg", 150.0, 200.0, "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400"),
        ("Bio NPK Fertilizer Blend", "1 L", 280.0, 350.0, "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"),
        ("Certified Basmati Rice Seeds", "2 kg", 190.0, 250.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"),
        ("Neem Oil Organic Pest Spray", "500 ml", 180.0, 240.0, "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400")
    ],
    "farm-tools": [
        ("Heavy Duty Hand Trowel", "Cast Aluminum", 180.0, 250.0, "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=400"),
        ("Garden Pruning Shears", "SK-5 High Carbon Steel", 340.0, 480.0, "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400"),
        ("Battery Operated Knapsack Sprayer", "16 Liters", 2499.0, 3499.0, "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400"),
        ("Soil Moisture Meter Sensor", "3-in-1 pH & Moisture", 450.0, 650.0, "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400"),
        ("Forged Steel Farming Hoe (Kudal)", "Heavy Grade Wood Handle", 420.0, 580.0, "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400")
    ]
}

VARIETY_MODIFIERS = [
    "Select", "Premium", "Farm Fresh", "Organic Gold", "Valley Special",
    "High Yield", "Native Heirloom", "Sun-Dried", "Pure", "Export Grade"
]

async def seed_database():
    print("Beginning KrishiGo database seeding...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if already seeded with categories
        cat_check = await session.execute(select(Category))
        categories = cat_check.scalars().all()

        cat_map = {}
        if not categories:
            print("Creating 19 approved KrishiGo Categories (NO ELECTRONICS)...")
            for cat_data in CATEGORIES:
                cat = Category(
                    name=cat_data["name"],
                    slug=cat_data["slug"],
                    description=cat_data["description"],
                    order_index=cat_data["order_index"]
                )
                session.add(cat)
                await session.flush()
                cat_map[cat.slug] = cat.id
        else:
            for cat in categories:
                cat_map[cat.slug] = cat.id

        # Check default user
        user_check = await session.execute(select(User).where(User.email == "user@krishigo.com"))
        user = user_check.scalar_one_or_none()
        if not user:
            print("Creating default verified user and address...")
            user = User(
                name="User",
                email="user@krishigo.com",
                phone="+919876543210",
                hashed_password=hash_password("krishigo123"),
                is_farmer=True,
                is_admin=True,
                wallet_balance=848.0
            )
            session.add(user)
            await session.flush()

            # Add default address
            addr = Address(
                user_id=user.id,
                tag="Home",
                full_address="Flat 4B, Green Terrace, Siliguri",
                landmark="Near City Center",
                city="Siliguri",
                state="West Bengal",
                postal_code="734001",
                latitude=26.7271,
                longitude=88.3953,
                is_default=True
            )
            session.add(addr)

            # Add initial wallet transaction
            tx = WalletTransaction(
                user_id=user.id,
                amount=848.0,
                transaction_type="CREDIT",
                description="Welcome balance & cashback credit",
                reference_id="WAL-INIT-848"
            )
            session.add(tx)
            await session.flush()

        # Seed Farmer profile and farm
        farmer_check = await session.execute(select(FarmerProfile).where(FarmerProfile.user_id == user.id))
        farmer = farmer_check.scalar_one_or_none()
        if not farmer:
            print("Creating Farmer profile & farm with fields matching reference screenshots...")
            farmer = FarmerProfile(
                user_id=user.id,
                display_name="User",
                language="English",
                state="West Bengal",
                district="Darjeeling",
                village="Siliguri Rural",
                farming_experience_years=12,
                farming_type="Organic & Mixed"
            )
            session.add(farmer)
            await session.flush()

            farm = Farm(
                farmer_id=farmer.id,
                farm_name="KrishiGo Smart Farm Siliguri",
                address="Siliguri, West Bengal",
                latitude=26.7271,
                longitude=88.3953,
                total_area=2.5,
                area_unit="Acres",
                soil_type="Loamy",
                irrigation_type="Drip & Sprinkler",
                water_source="Borewell & River Channel",
                farming_method="Integrated Organic"
            )
            session.add(farm)
            await session.flush()

            # Fields matching the screenshots
            fields_data = [
                {
                    "name": "Field 1", "area": 1.0, "crop": "Tomato", "variety": "Pusa Ruby",
                    "planting": "15 Jun 2026", "harvest": "20 Oct 2026", "stage": "Vegetative",
                    "health": "Healthy", "growth": 45, "soil": "Loamy Soil", "irrigation": "Drip Irrigation",
                    "cctv": "Live", "cctv_count": 2
                },
                {
                    "name": "Field 2", "area": 0.8, "crop": "Potato", "variety": "Kufri Jyoti",
                    "planting": "10 May 2026", "harvest": "15 Sep 2026", "stage": "Flowering",
                    "health": "Good", "growth": 70, "soil": "Loamy Soil", "irrigation": "Sprinkler",
                    "cctv": "Live", "cctv_count": 1
                },
                {
                    "name": "Field 3", "area": 0.7, "crop": "Mustard", "variety": "Pusa Bold",
                    "planting": "01 Jun 2026", "harvest": "10 Nov 2026", "stage": "Early Growth",
                    "health": "Needs Attention", "growth": 30, "soil": "Clayey Loam", "irrigation": "Furrow",
                    "cctv": "Offline", "cctv_count": 0
                },
                {
                    "name": "Field 4", "area": 0.8, "crop": "Vegetables", "variety": "Mixed Greens",
                    "planting": "20 Jun 2026", "harvest": "30 Oct 2026", "stage": "Vegetative",
                    "health": "Healthy", "growth": 60, "soil": "Sandy Loam", "irrigation": "Drip Irrigation",
                    "cctv": "Live", "cctv_count": 1
                }
            ]

            for fd in fields_data:
                field = FarmField(
                    farm_id=farm.id,
                    field_name=fd["name"],
                    area=fd["area"],
                    current_crop=fd["crop"],
                    crop_variety=fd["variety"],
                    planting_date=fd["planting"],
                    expected_harvest_date=fd["harvest"],
                    growth_stage=fd["stage"],
                    health_status=fd["health"],
                    growth_percent=fd["growth"],
                    soil_type=fd["soil"],
                    irrigation_type=fd["irrigation"],
                    cctv_status=fd["cctv"],
                    cctv_count=fd["cctv_count"]
                )
                session.add(field)

            # Farm Tasks matching screenshot
            tasks = [
                ("Apply Urea in Wheat Field", "Field 1", "Wheat", "Fertilizer", "Tomorrow", "06:00 AM - 08:00 AM", "High"),
                ("Irrigate Potato Field", "Field 2", "Potato", "Irrigation", "In 2 Days", "07:00 AM - 09:00 AM", "Medium"),
                ("Pesticide Spray (Tomato)", "Field 1", "Tomato", "Pesticide", "In 5 Days", "06:30 AM - 08:30 AM", "High"),
                ("Harvest Mustard", "Field 3", "Mustard", "Harvest", "In 8 Days", "08:00 AM - 12:00 PM", "High"),
                ("Weeding in Field 3 (Maize)", "Field 3", "Maize", "Weeding", "Tomorrow", "04:00 PM - 05:00 PM", "Medium"),
                ("Soil Testing Sample Collection", "Field 4", "Vegetables", "Soil", "In 3 Days", "09:00 AM - 11:00 AM", "Low"),
            ]
            for title, fld, crp, t_type, s_date, s_time, prio in tasks:
                t = FarmTask(
                    farm_id=farm.id,
                    field_name=fld,
                    crop_name=crp,
                    title=title,
                    task_type=t_type,
                    scheduled_date=s_date,
                    scheduled_time=s_time,
                    priority=prio,
                    is_completed=False
                )
                session.add(t)

            # Farm Expenses & Income matching screenshot (₹38,450 profit)
            expenses = [
                ("Fertilizer & NPK nutrients", "Fertilizer", 4500.0, "12 May 2026"),
                ("Labor charges for weeding", "Labor", 3200.0, "18 May 2026"),
                ("Drip irrigation maintenance", "Irrigation", 1800.0, "20 May 2026"),
                ("Certified seed procurement", "Seeds", 3000.0, "22 May 2026"),
            ]
            for exp_title, cat_name, amt, d_str in expenses:
                e = FarmExpense(farm_id=farm.id, title=exp_title, category=cat_name, amount=amt, date=d_str)
                session.add(e)

            incomes = [
                ("Tomato Early Harvest (650 kg)", "Tomato", 650.0, "kg", 18200.0, "15 May 2026"),
                ("Organic Spinach & Greens", "Vegetables", 400.0, "kg", 12000.0, "20 May 2026"),
                ("Potato Wholesale Batch", "Potato", 1200.0, "kg", 20750.0, "23 May 2026"),
            ]
            for inc_title, crp_name, qty, un, amt, d_str in incomes:
                inc = FarmIncome(farm_id=farm.id, title=inc_title, crop_name=crp_name, quantity=qty, unit=un, amount=amt, date=d_str)
                session.add(inc)

            # CCTV cameras matching screenshot
            cams = [
                ("Field Camera", "Field 1 - Main Camera", "LIVE"),
                ("Storage", "Barn & Supply Storage", "LIVE"),
                ("Entrance", "Main Gate & Road", "LIVE"),
                ("Field 1 - North Side", "North Boundary", "LIVE"),
            ]
            for cam_name, loc, stat in cams:
                c = CCTVCamera(farm_id=farm.id, name=cam_name, location_tag=loc, status=stat, is_active=True, events_count=random.randint(2, 8))
                session.add(c)

        # Seed Market Prices matching screenshot
        market_check = await session.execute(select(MarketPriceRecord))
        if not market_check.scalars().first():
            print("Creating live agricultural market records...")
            m_records = [
                ("Tomato", "Siliguri Mandi", 17.5, 18.5, 19.5, 5.2, "kg", "High Demand"),
                ("Potato", "Siliguri Mandi", 15.7, 16.2, 16.8, 3.1, "kg", "Steady Demand"),
                ("Mustard", "Siliguri Mandi", 46.1, 48.3, 49.0, 4.7, "kg", "High Demand"),
                ("Onion", "Siliguri Mandi", 20.4, 20.1, 19.8, -1.3, "kg", "Moderate Demand"),
                ("Rice (Basmati)", "Siliguri Mandi", 42.0, 44.5, 45.0, 5.9, "kg", "Very High Demand"),
                ("Wheat", "Siliguri Mandi", 24.0, 25.5, 26.0, 6.2, "kg", "Stable Demand"),
                ("Green Chili", "Siliguri Mandi", 55.0, 60.0, 62.0, 9.1, "kg", "High Demand"),
                ("Maize", "Siliguri Mandi", 21.0, 22.0, 22.5, 4.8, "kg", "Steady Demand"),
            ]
            for com, m_name, y_p, t_p, tom_p, chg, un, dem in m_records:
                # 30 day history
                history = []
                cur = y_p
                for i in range(30, 0, -1):
                    day_date = (datetime.date.today() - datetime.timedelta(days=i)).strftime("%d %b")
                    cur = round(max(10.0, cur + random.uniform(-0.8, 1.0)), 2)
                    history.append({"date": day_date, "price": cur})

                rec = MarketPriceRecord(
                    commodity=com,
                    market_name=m_name,
                    yesterday_price=y_p,
                    today_price=t_p,
                    tomorrow_estimated_price=tom_p,
                    price_change_percent=chg,
                    unit=un,
                    demand_trend=dem,
                    history_json=history
                )
                session.add(rec)

        # Seed Service Providers matching screenshot
        provider_check = await session.execute(select(ServiceProvider))
        if not provider_check.scalars().first():
            print("Creating nearby agricultural service providers...")
            providers = [
                ("Siliguri Agro Services", "Farm Machinery", 4.8, 120, 5.0, "Siliguri", "+91 98765 11001", "Tractor, Rotavator, Planter, Harvester rental", "From ₹600/hour", "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400", ["Tractor", "Rotavator", "Harvester"]),
                ("Green Seeds Center", "Seeds & Plants", 4.7, 86, 6.0, "Siliguri Center", "+91 98765 22002", "Certified seeds, seedlings, saplings and bio-inputs", "Certified Quality", "https://images.unsplash.com/photo-1598512752271-33f913a5af13?w=400", ["Seeds", "Fertilizer", "Pesticides"]),
                ("Kisan Labor Group", "Labor & Workforce", 4.6, 62, 8.0, "Matigara", "+91 98765 33003", "Skilled and unskilled verified farm workforce", "From ₹400/day", "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400", ["Farm Labor", "Harvesting", "Planting"]),
                ("Soil Health Lab", "Soil & Water Testing", 4.9, 210, 10.0, "Jalpaiguri Road", "+91 98765 44004", "Comprehensive NPK, micronutrient and water test reports", "From ₹400/sample", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400", ["Soil Test", "Water Test", "Report"]),
                ("Agri Drone India", "Drone Services", 4.8, 75, 12.0, "Siliguri Outer", "+91 98765 55005", "Precision aerial spraying, crop mapping & thermal health monitoring", "From ₹500/acre", "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400", ["Drone Spray", "Mapping", "Survey"])
            ]
            for p_name, p_cat, p_rat, p_rev, p_dist, p_loc, p_ph, p_desc, p_pr, p_img, p_srvs in providers:
                sp = ServiceProvider(
                    name=p_name,
                    category=p_cat,
                    rating=p_rat,
                    reviews_count=p_rev,
                    distance_km=p_dist,
                    location=p_loc,
                    phone=p_ph,
                    description=p_desc,
                    price_info=p_pr,
                    image_url=p_img,
                    is_verified=True,
                    services_list=p_srvs
                )
                session.add(sp)

        # Seed Government Schemes matching screenshot
        scheme_check = await session.execute(select(GovernmentScheme))
        if not scheme_check.scalars().first():
            print("Creating verified government agricultural schemes...")
            schemes = [
                ("PM Kisan Samman Nidhi", "Ministry of Agriculture", "Direct income support of ₹6,000 per year in 3 equal installments to eligible farmer families.", "All landholding farmer families with cultivable land in their names.", "₹6,000 / year direct transfer", "Ongoing (FY 2026-27)", "pmkisan.gov.in"),
                ("Kisan Credit Card (KCC)", "NABARD & Commercial Banks", "Concessional institutional credit to farmers for crop production, post-harvest expenses and maintenance.", "All farmers, sharecroppers, tenant farmers, self-help groups.", "Loans up to ₹3 Lakh at 4% effective interest", "Continuous", "pmkisan.gov.in/kcc"),
                ("e-NAM (National Agriculture Market)", "Small Farmers Agribusiness Consortium", "Pan-India electronic trading portal networking existing APMC mandis to create a unified national market for agricultural commodities.", "Registered farmers, mandis and traders across India.", "Better price realization & transparent online bidding", "Active Nationwide", "enam.gov.in"),
                ("Pradhan Mantri Fasal Bima Yojana (PMFBY)", "Ministry of Agriculture", "Comprehensive crop insurance against non-preventable natural risks from pre-sowing to post-harvest.", "All farmers growing notified crops in notified areas.", "Subsidized premium (2% Kharif, 1.5% Rabi)", "Per Season Cutoff", "pmfby.gov.in"),
                ("Sub-Mission on Agricultural Mechanization (SMAM)", "Department of Agriculture", "Financial subsidy for purchasing agricultural equipment, power tillers, tractors and drone setups.", "Small, marginal, SC/ST and women farmers receive priority 40-50% subsidy.", "40% to 50% capital subsidy on farm machinery", "Annual Allocation", "agrimachinery.nic.in")
            ]
            for s_name, s_auth, s_desc, s_elig, s_ben, s_dead, s_src in schemes:
                gs = GovernmentScheme(
                    scheme_name=s_name,
                    authority=s_auth,
                    description=s_desc,
                    eligibility=s_elig,
                    benefits=s_ben,
                    deadline=s_dead,
                    official_source=s_src,
                    last_verified="May 2026"
                )
                session.add(gs)

        # Check Product Count - if less than 10,000, expand deterministically!
        prod_count_check = await session.execute(select(Product))
        existing_count = len(prod_count_check.scalars().all())
        if existing_count < 10000:
            print(f"Current products: {existing_count}. Seeding 10,000+ deterministic products across all categories...")
            products_to_add = []
            sku_counter = existing_count + 1

            # First add all core featured products exactly matching screenshot
            featured_items = [
                # Fresh vegetables section in screenshot
                ("Tomato", "fresh-vegetables", "1 kg", 18.0, 30.0, 40, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400"),
                ("Potato", "fresh-vegetables", "1 kg", 16.0, 26.0, 38, "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400"),
                ("Onion", "fresh-vegetables", "1 kg", 20.0, 32.0, 38, "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400"),
                ("Carrot", "fresh-vegetables", "500 g", 24.0, 40.0, 40, "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400"),
                ("Capsicum", "fresh-vegetables", "500 g", 28.0, 45.0, 38, "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400"),
                ("Spinach (Palak)", "fresh-vegetables", "250 g", 12.0, 30.0, 38, "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400"),
                ("Cauliflower", "fresh-vegetables", "1 pc", 28.0, 45.0, 38, "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400"),
                ("Brinjal", "fresh-vegetables", "500 g", 18.0, 30.0, 40, "https://images.unsplash.com/photo-1628773822503-930a84d943ef?w=400"),

                # Study essentials in screenshot
                ("Notebook", "study-essentials", "180 Pages", 40.0, 50.0, 20, "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"),
                ("Pen Set", "study-essentials", "Pack of 5", 99.0, 149.0, 34, "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400"),
                ("School Bag", "study-essentials", "Waterproof 28L", 499.0, 899.0, 45, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"),
                ("Textbooks", "study-essentials", "Class Reference", 299.0, 399.0, 25, "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400"),
                ("Calculator", "study-essentials", "Scientific Dual Power", 499.0, 699.0, 29, "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400"),
                ("Study Table", "study-essentials", "Ergonomic Foldable", 2999.0, 4499.0, 33, "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400"),

                # Clothing & fashion in screenshot
                ("Men T-Shirt", "clothing-fashion", "Bio-Washed Cotton", 399.0, 699.0, 43, "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400"),
                ("Women Kurti", "clothing-fashion", "Printed Rayon", 699.0, 1199.0, 42, "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400"),
                ("Kids Wear", "clothing-fashion", "Pure Cotton Dungaree", 499.0, 899.0, 44, "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400"),
                ("Sports Shoes", "clothing-fashion", "All-Terrain Running", 1299.0, 2199.0, 41, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"),
                ("Jeans", "clothing-fashion", "Stretch Denim", 899.0, 1599.0, 44, "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400"),
                ("Saree", "clothing-fashion", "Linen Zari Border", 999.0, 1999.0, 50, "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400"),

                # Pharmacy & health in screenshot
                ("Vitamin D", "pharmacy-health", "60 Caps", 400.0, 550.0, 27, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400"),
                ("Pain Relief", "pharmacy-health", "50g Herbal", 99.0, 140.0, 29, "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400"),
                ("Face Mask", "pharmacy-health", "Pack of 10", 149.0, 249.0, 40, "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400"),
                ("Sanitizer", "pharmacy-health", "500 ml Pump", 99.0, 149.0, 34, "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400"),
                ("Thermometer", "pharmacy-health", "Fast Read Digital", 249.0, 399.0, 38, "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400"),
                ("First Aid Kit", "pharmacy-health", "Emergency 42 Pcs", 499.0, 799.0, 38, "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400")
            ]

            for name, c_slug, unit, price, mrp, disc, img in featured_items:
                c_id = cat_map.get(c_slug, 1)
                p = Product(
                    name=name,
                    slug=f"{name.lower().replace(' ', '-').replace('(', '').replace(')', '')}-{sku_counter}",
                    brand="KrishiGo",
                    category_id=c_id,
                    unit=unit,
                    price=price,
                    mrp=mrp,
                    discount_percent=disc,
                    rating=round(random.uniform(4.5, 4.9), 1),
                    review_count=random.randint(50, 450),
                    freshness_score=random.randint(94, 99),
                    is_organic=True,
                    is_pesticide_safe=True,
                    is_farm_fresh=True,
                    farm_source_name="Siliguri Organic Farm Collective",
                    description=f"100% genuine {name}. Direct from verified farmer sources. Guaranteed fresh and quality inspected.",
                    images=[img],
                    stock=random.randint(40, 200),
                    sku=f"KG-{c_slug[:3].upper()}-{sku_counter:06d}",
                    source_type="FARMER"
                )
                products_to_add.append(p)
                sku_counter += 1

            # Deterministic generator up to 10,100 products
            rng = random.Random(42) # fixed seed
            all_cat_slugs = list(PRODUCT_TEMPLATES.keys())
            total_target = 10050

            while sku_counter <= total_target:
                c_slug = rng.choice(all_cat_slugs)
                c_id = cat_map.get(c_slug, 1)
                base_item = rng.choice(PRODUCT_TEMPLATES[c_slug])
                base_name, base_unit, base_price, base_mrp, base_img = base_item
                mod = rng.choice(VARIETY_MODIFIERS)
                var_num = (sku_counter % 900) + 1

                p_name = f"{mod} {base_name} Grade-{var_num}"
                p_slug = f"{p_name.lower().replace(' ', '-').replace('/', '-')}-{sku_counter}"
                price_var = round(base_price * rng.uniform(0.85, 1.25), 2)
                mrp_var = round(price_var * rng.uniform(1.2, 1.6), 2)
                disc_pct = int(round((mrp_var - price_var) / mrp_var * 100))

                p = Product(
                    name=p_name,
                    slug=p_slug,
                    brand="KrishiGo Naturals" if c_slug in ["fresh-vegetables", "fresh-fruits", "seeds-fertilizers"] else "KrishiGo Select",
                    category_id=c_id,
                    unit=base_unit,
                    price=price_var,
                    mrp=mrp_var,
                    discount_percent=disc_pct,
                    rating=round(rng.uniform(4.2, 5.0), 1),
                    review_count=rng.randint(15, 600),
                    freshness_score=rng.randint(90, 100),
                    is_organic=rng.choice([True, True, False]),
                    is_pesticide_safe=True,
                    is_farm_fresh=c_slug in ["fresh-vegetables", "fresh-fruits", "dairy-milk"],
                    farm_source_name="North Bengal Organic Producers",
                    description=f"Premium grade {p_name} sourced directly through KrishiGo farm network.",
                    images=[base_img],
                    stock=rng.randint(20, 500),
                    sku=f"KG-{c_slug[:3].upper()}-{sku_counter:06d}",
                    source_type="FARMER" if c_slug in ["fresh-vegetables", "fresh-fruits"] else "SUPPLIER"
                )
                products_to_add.append(p)
                sku_counter += 1

                if len(products_to_add) >= 1000:
                    session.add_all(products_to_add)
                    await session.flush()
                    products_to_add = []
                    print(f"Seeded up to SKU {sku_counter}...")

            if products_to_add:
                session.add_all(products_to_add)
                await session.flush()

        await session.commit()
        print("Database successfully seeded with 10,000+ products, Farmer intelligence fixtures & accounts!")

if __name__ == "__main__":
    asyncio.run(seed_database())
