import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="User")
    email = Column(String(120), unique=True, index=True, nullable=True)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    avatar_url = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=True)
    status = Column(String(20), default="ACTIVE")
    is_farmer = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    wallet_balance = Column(Float, default=848.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user")
    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    wallet_transactions = relationship("WalletTransaction", back_populates="user")

class Address(Base):
    __tablename__ = "addresses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    tag = Column(String(50), default="Home") # Home, Work, Farm
    full_address = Column(String(255))
    landmark = Column(String(100), nullable=True)
    city = Column(String(100), default="Kolkata")
    state = Column(String(100), default="West Bengal")
    postal_code = Column(String(20), default="700001")
    latitude = Column(Float, default=22.5726)
    longitude = Column(Float, default=88.3639)
    is_default = Column(Boolean, default=True)

    user = relationship("User", back_populates="addresses")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    slug = Column(String(100), unique=True, index=True)
    description = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=True)
    order_index = Column(Integer, default=0)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), index=True)
    slug = Column(String(200), unique=True, index=True)
    brand = Column(String(100), default="KrishiGo Organics")
    category_id = Column(Integer, ForeignKey("categories.id"), index=True)
    unit = Column(String(50), default="1 kg")
    price = Column(Float, default=0.0)
    mrp = Column(Float, default=0.0)
    discount_percent = Column(Integer, default=0)
    rating = Column(Float, default=4.8)
    review_count = Column(Integer, default=120)
    freshness_score = Column(Integer, default=98)
    is_organic = Column(Boolean, default=True)
    is_pesticide_safe = Column(Boolean, default=True)
    is_farm_fresh = Column(Boolean, default=True)
    farm_source_name = Column(String(100), default="Siliguri Organic Farm Collective")
    description = Column(Text, nullable=True)
    images = Column(JSON, default=list)
    stock = Column(Integer, default=100)
    sku = Column(String(50), unique=True, index=True)
    source_type = Column(String(50), default="FARMER") # FARMER, SEED, SUPPLIER
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    category = relationship("Category", back_populates="products")

class CartItem(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    product_id = Column(Integer, ForeignKey("products.id"), index=True)
    quantity = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="cart_items")
    product = relationship("Product")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    status = Column(String(50), default="CONFIRMED") # PENDING, CONFIRMED, PREPARING, PACKED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    subtotal = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    delivery_fee = Column(Float, default=0.0)
    wallet_deduction = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    payment_method = Column(String(50), default="UPI")
    payment_status = Column(String(50), default="PAID")
    delivery_address = Column(JSON, default=dict)
    estimated_delivery_minutes = Column(Integer, default=15)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    product_name = Column(String(200))
    price = Column(Float)
    quantity = Column(Integer)
    unit = Column(String(50))
    image_url = Column(String(255), nullable=True)

    order = relationship("Order", back_populates="items")

class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    amount = Column(Float)
    transaction_type = Column(String(50)) # CREDIT, DEBIT, CASHBACK, REFUND
    description = Column(String(255))
    reference_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="wallet_transactions")

# ==================== FARMER INTELLIGENCE MODELS ====================

class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True)
    display_name = Column(String(100), default="User")
    language = Column(String(50), default="English")
    state = Column(String(100), default="West Bengal")
    district = Column(String(100), default="Darjeeling")
    village = Column(String(100), default="Siliguri Rural")
    farming_experience_years = Column(Integer, default=12)
    farming_type = Column(String(50), default="Organic / Mixed")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Farm(Base):
    __tablename__ = "farms"
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmer_profiles.id"), index=True)
    farm_name = Column(String(100), default="Green Valley Farm")
    address = Column(String(255), default="Siliguri, West Bengal")
    latitude = Column(Float, default=26.7271)
    longitude = Column(Float, default=88.3953)
    total_area = Column(Float, default=2.5)
    area_unit = Column(String(20), default="Acres")
    soil_type = Column(String(50), default="Loamy")
    irrigation_type = Column(String(50), default="Drip & Sprinkler")
    water_source = Column(String(50), default="Borewell & River")
    farming_method = Column(String(50), default="Integrated Organic")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    fields = relationship("FarmField", back_populates="farm", cascade="all, delete-orphan")

class FarmField(Base):
    __tablename__ = "farm_fields"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), index=True)
    field_name = Column(String(100), default="Field 1")
    area = Column(Float, default=1.0)
    area_unit = Column(String(20), default="Acres")
    current_crop = Column(String(100), default="Tomato")
    crop_variety = Column(String(100), default="Pusa Ruby")
    planting_date = Column(String(50), default="15 Jun 2026")
    expected_harvest_date = Column(String(50), default="20 Oct 2026")
    growth_stage = Column(String(100), default="Vegetative")
    health_status = Column(String(50), default="Healthy") # Healthy, Good, Needs Attention
    growth_percent = Column(Integer, default=45)
    soil_type = Column(String(50), default="Clayey Loam")
    irrigation_type = Column(String(50), default="Drip Irrigation")
    cctv_status = Column(String(50), default="Live")
    cctv_count = Column(Integer, default=2)
    polygon_coordinates = Column(JSON, default=list)

    farm = relationship("Farm", back_populates="fields")

class FarmTask(Base):
    __tablename__ = "farm_tasks"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), index=True)
    field_name = Column(String(100), default="Field 1")
    title = Column(String(255))
    crop_name = Column(String(100), default="Tomato")
    task_type = Column(String(50), default="Routine")
    scheduled_date = Column(String(50), default="Tomorrow")
    scheduled_time = Column(String(50), default="06:00 AM - 08:00 AM")
    is_completed = Column(Boolean, default=False)
    priority = Column(String(20), default="Medium")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class FarmExpense(Base):
    __tablename__ = "farm_expenses"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), index=True)
    title = Column(String(255))
    category = Column(String(50), default="Fertilizer")
    amount = Column(Float, default=0.0)
    date = Column(String(50))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class FarmIncome(Base):
    __tablename__ = "farm_incomes"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), index=True)
    title = Column(String(255))
    crop_name = Column(String(100), default="Tomato")
    quantity = Column(Float, default=0.0)
    unit = Column(String(50), default="kg")
    amount = Column(Float, default=0.0)
    date = Column(String(50))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class MarketPriceRecord(Base):
    __tablename__ = "market_prices"
    id = Column(Integer, primary_key=True, index=True)
    commodity = Column(String(100), index=True)
    market_name = Column(String(100), default="Siliguri Mandi")
    state = Column(String(100), default="West Bengal")
    district = Column(String(100), default="Darjeeling")
    yesterday_price = Column(Float, default=17.5)
    today_price = Column(Float, default=18.5)
    tomorrow_estimated_price = Column(Float, default=19.2)
    price_change_percent = Column(Float, default=5.2)
    unit = Column(String(20), default="kg")
    demand_trend = Column(String(50), default="High Demand")
    history_json = Column(JSON, default=list)
    observed_at = Column(DateTime, default=datetime.datetime.utcnow)

class ServiceProvider(Base):
    __tablename__ = "service_providers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150))
    category = Column(String(100))
    rating = Column(Float, default=4.8)
    reviews_count = Column(Integer, default=120)
    distance_km = Column(Float, default=5.0)
    location = Column(String(150), default="Siliguri")
    phone = Column(String(50), default="+91 98765 43210")
    description = Column(Text, nullable=True)
    price_info = Column(String(100), default="From ₹600/hour")
    image_url = Column(String(255), nullable=True)
    is_verified = Column(Boolean, default=True)
    services_list = Column(JSON, default=list)

class GovernmentScheme(Base):
    __tablename__ = "government_schemes"
    id = Column(Integer, primary_key=True, index=True)
    scheme_name = Column(String(200))
    authority = Column(String(150), default="Ministry of Agriculture & Farmers Welfare")
    description = Column(Text)
    eligibility = Column(Text)
    benefits = Column(String(255))
    deadline = Column(String(100), default="Ongoing (FY 2026-27)")
    official_source = Column(String(255), default="pmkisan.gov.in")
    last_verified = Column(String(50), default="May 2026")

class CCTVCamera(Base):
    __tablename__ = "cctv_cameras"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, default=1)
    name = Column(String(100), default="Field Camera 1")
    location_tag = Column(String(100), default="Main Field")
    stream_url = Column(String(255), nullable=True)
    status = Column(String(50), default="LIVE") # LIVE, OFFLINE, NOT_CONFIGURED
    is_active = Column(Boolean, default=True)
    events_count = Column(Integer, default=0)

class AIConversation(Base):
    __tablename__ = "ai_conversations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    title = Column(String(200), default="Farm Advisory")
    mode = Column(String(50), default="chat")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    messages = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan")

class AIMessage(Base):
    __tablename__ = "ai_messages"
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("ai_conversations.id"), index=True)
    sender = Column(String(20)) # user, ai, system
    text = Column(Text)
    tool_calls = Column(JSON, nullable=True)
    attachments = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    conversation = relationship("AIConversation", back_populates="messages")
