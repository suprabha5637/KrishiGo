from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, or_
from typing import List, Optional
import datetime
import random
from backend.app.core.database import get_db
from backend.app.models.all_models import (
    Category, Product, CartItem, Order, OrderItem, WalletTransaction, User, Address
)
from backend.app.schemas.all_schemas import CartItemCreate, CartItemUpdate, OrderCreate

router = APIRouter(prefix="/commerce", tags=["E-Commerce Marketplace"])

@router.get("/categories")
async def get_categories(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Category).order_by(Category.order_index))
    categories = res.scalars().all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "slug": c.slug,
            "description": c.description,
            "image_url": c.image_url,
            "order_index": c.order_index
        }
        for c in categories
    ]

@router.get("/products")
async def get_products(
    category_slug: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(24, ge=1, le=100),
    sort: Optional[str] = "popular", # popular, price_asc, price_desc, discount
    is_organic: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Product)

    if category_slug and category_slug != "all" and category_slug != "all-categories":
        cat_res = await db.execute(select(Category).where(Category.slug == category_slug))
        cat = cat_res.scalar_one_or_none()
        if cat:
            query = query.where(Product.category_id == cat.id)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.where(
            or_(
                Product.name.ilike(search_term),
                Product.brand.ilike(search_term),
                Product.description.ilike(search_term)
            )
        )

    if is_organic is not None:
        query = query.where(Product.is_organic == is_organic)

    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort == "discount":
        query = query.order_by(Product.discount_percent.desc())
    else:
        query = query.order_by(Product.id.asc())

    # Count total
    count_res = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_res.scalar_one()

    # Paginate
    query = query.offset((page - 1) * limit).limit(limit)
    res = await db.execute(query)
    products = res.scalars().all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "products": [
            {
                "id": p.id,
                "name": p.name,
                "slug": p.slug,
                "brand": p.brand,
                "category_id": p.category_id,
                "unit": p.unit,
                "price": p.price,
                "mrp": p.mrp,
                "discount_percent": p.discount_percent,
                "rating": p.rating,
                "review_count": p.review_count,
                "freshness_score": p.freshness_score,
                "is_organic": p.is_organic,
                "is_pesticide_safe": p.is_pesticide_safe,
                "is_farm_fresh": p.is_farm_fresh,
                "farm_source_name": p.farm_source_name,
                "description": p.description,
                "images": p.images,
                "stock": p.stock,
                "sku": p.sku
            }
            for p in products
        ]
    }

@router.get("/products/featured")
async def get_featured_products(db: AsyncSession = Depends(get_db)):
    # Fresh Vegetables matching screenshot
    veg_cat = await db.execute(select(Category).where(Category.slug == "fresh-vegetables"))
    vc = veg_cat.scalar_one_or_none()
    veg_products = []
    if vc:
        res = await db.execute(select(Product).where(Product.category_id == vc.id).limit(8))
        veg_products = res.scalars().all()

    # Study Essentials matching screenshot
    study_cat = await db.execute(select(Category).where(Category.slug == "study-essentials"))
    sc = study_cat.scalar_one_or_none()
    study_products = []
    if sc:
        res = await db.execute(select(Product).where(Product.category_id == sc.id).limit(6))
        study_products = res.scalars().all()

    # Clothing & Fashion matching screenshot
    cloth_cat = await db.execute(select(Category).where(Category.slug == "clothing-fashion"))
    cc = cloth_cat.scalar_one_or_none()
    clothing_products = []
    if cc:
        res = await db.execute(select(Product).where(Product.category_id == cc.id).limit(6))
        clothing_products = res.scalars().all()

    # Pharmacy & Health matching screenshot
    pharm_cat = await db.execute(select(Category).where(Category.slug == "pharmacy-health"))
    pc = pharm_cat.scalar_one_or_none()
    pharmacy_products = []
    if pc:
        res = await db.execute(select(Product).where(Product.category_id == pc.id).limit(6))
        pharmacy_products = res.scalars().all()

    def map_p(p):
        return {
            "id": p.id,
            "name": p.name,
            "slug": p.slug,
            "brand": p.brand,
            "unit": p.unit,
            "price": p.price,
            "mrp": p.mrp,
            "discount_percent": p.discount_percent,
            "rating": p.rating,
            "freshness_score": p.freshness_score,
            "is_organic": p.is_organic,
            "farm_source_name": p.farm_source_name,
            "images": p.images,
            "stock": p.stock
        }

    return {
        "fresh_vegetables": [map_p(p) for p in veg_products],
        "study_essentials": [map_p(p) for p in study_products],
        "clothing_fashion": [map_p(p) for p in clothing_products],
        "pharmacy_health": [map_p(p) for p in pharmacy_products],
        "promotions": [
            {
                "id": "promo-1",
                "tag": "FLAT 50% OFF",
                "title": "Fresh Vegetables",
                "cta": "Shop Now →",
                "bg_gradient": "from-emerald-700 to-green-900",
                "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
                "category_slug": "fresh-vegetables"
            },
            {
                "id": "promo-2",
                "tag": "Up to 40% OFF",
                "title": "Fruits & Dairy",
                "cta": "Shop Now →",
                "bg_gradient": "from-amber-600 to-yellow-800",
                "image": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400",
                "category_slug": "fresh-fruits"
            },
            {
                "id": "promo-3",
                "tag": "Daily Essentials",
                "title": "Lowest Prices",
                "cta": "Shop Now →",
                "bg_gradient": "from-red-600 to-rose-800",
                "image": "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400",
                "category_slug": "grocery-staples"
            },
            {
                "id": "promo-4",
                "tag": "Study Essentials",
                "title": "For a Brighter Tomorrow",
                "cta": "Shop Now →",
                "bg_gradient": "from-blue-600 to-indigo-800",
                "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
                "category_slug": "study-essentials"
            },
            {
                "id": "promo-5",
                "tag": "Clothing & Fashion",
                "title": "Stylish & Affordable",
                "cta": "Shop Now →",
                "bg_gradient": "from-pink-600 to-rose-700",
                "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400",
                "category_slug": "clothing-fashion"
            }
        ]
    }

@router.get("/products/{slug}")
async def get_product_details(slug: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Product).where(Product.slug == slug))
    product = res.scalar_one_or_none()
    if not product:
        # Fallback to search by id if slug is numeric
        if slug.isdigit():
            res2 = await db.execute(select(Product).where(Product.id == int(slug)))
            product = res2.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return {
        "id": product.id,
        "name": product.name,
        "slug": product.slug,
        "brand": product.brand,
        "unit": product.unit,
        "price": product.price,
        "mrp": product.mrp,
        "discount_percent": product.discount_percent,
        "rating": product.rating,
        "review_count": product.review_count,
        "freshness_score": product.freshness_score,
        "is_organic": product.is_organic,
        "is_pesticide_safe": product.is_pesticide_safe,
        "is_farm_fresh": product.is_farm_fresh,
        "farm_source_name": product.farm_source_name,
        "description": product.description,
        "images": product.images,
        "stock": product.stock,
        "sku": product.sku,
        "delivery_eta": "10-15 mins"
    }

# ==================== CART ENDPOINTS ====================

@router.get("/cart")
async def get_cart(db: AsyncSession = Depends(get_db)):
    # Default to user 1 for development/demo
    user_res = await db.execute(select(User).limit(1))
    user = user_res.scalars().first()
    if not user:
        return {"items": [], "subtotal": 0, "delivery_fee": 0, "total": 0}

    cart_res = await db.execute(
        select(CartItem, Product)
        .join(Product, CartItem.product_id == Product.id)
        .where(CartItem.user_id == user.id)
    )
    items = []
    subtotal = 0.0
    for cart_item, product in cart_res.all():
        line_total = product.price * cart_item.quantity
        subtotal += line_total
        items.append({
            "id": cart_item.id,
            "product_id": product.id,
            "product_name": product.name,
            "product_slug": product.slug,
            "price": product.price,
            "mrp": product.mrp,
            "unit": product.unit,
            "quantity": cart_item.quantity,
            "image": product.images[0] if product.images else None,
            "line_total": round(line_total, 2)
        })

    delivery_fee = 0.0 if subtotal > 199 or subtotal == 0 else 25.0
    total = round(subtotal + delivery_fee, 2)
    return {
        "items": items,
        "item_count": sum(i["quantity"] for i in items),
        "subtotal": round(subtotal, 2),
        "delivery_fee": delivery_fee,
        "total": total,
        "wallet_balance": user.wallet_balance
    }

@router.post("/cart")
async def add_to_cart(item: CartItemCreate, db: AsyncSession = Depends(get_db)):
    user_res = await db.execute(select(User).limit(1))
    user = user_res.scalars().first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    # Check if item exists in cart
    existing_res = await db.execute(
        select(CartItem).where(CartItem.user_id == user.id, CartItem.product_id == item.product_id)
    )
    existing = existing_res.scalar_one_or_none()
    if existing:
        existing.quantity += item.quantity
    else:
        new_item = CartItem(user_id=user.id, product_id=item.product_id, quantity=item.quantity)
        db.add(new_item)

    await db.commit()
    return {"message": "Added to cart", "status": "success"}

@router.put("/cart/{item_id}")
async def update_cart_item(item_id: int, item: CartItemUpdate, db: AsyncSession = Depends(get_db)):
    cart_res = await db.execute(select(CartItem).where(CartItem.id == item_id))
    cart_item = cart_res.scalar_one_or_none()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if item.quantity <= 0:
        await db.delete(cart_item)
    else:
        cart_item.quantity = item.quantity

    await db.commit()
    return {"message": "Cart updated", "status": "success"}

@router.delete("/cart/{item_id}")
async def delete_cart_item(item_id: int, db: AsyncSession = Depends(get_db)):
    cart_res = await db.execute(select(CartItem).where(CartItem.id == item_id))
    cart_item = cart_res.scalar_one_or_none()
    if cart_item:
        await db.delete(cart_item)
        await db.commit()
    return {"message": "Item removed", "status": "success"}

# ==================== CHECKOUT & ORDERS ====================

@router.post("/checkout")
async def checkout_order(req: OrderCreate, db: AsyncSession = Depends(get_db)):
    user_res = await db.execute(select(User).limit(1))
    user = user_res.scalars().first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    cart_res = await db.execute(
        select(CartItem, Product)
        .join(Product, CartItem.product_id == Product.id)
        .where(CartItem.user_id == user.id)
    )
    cart_items = cart_res.all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    subtotal = sum(product.price * c_item.quantity for c_item, product in cart_items)
    delivery_fee = 0.0 if subtotal > 199 else 25.0
    discount = round(subtotal * 0.05, 2) # 5% promotional discount

    wallet_deduction = 0.0
    if req.use_wallet and user.wallet_balance > 0:
        needed = subtotal + delivery_fee - discount
        wallet_deduction = min(needed, user.wallet_balance)
        user.wallet_balance -= wallet_deduction

        tx = WalletTransaction(
            user_id=user.id,
            amount=-wallet_deduction,
            transaction_type="DEBIT",
            description="Paid for KrishiGo Grocery Order",
            reference_id=f"ORD-PAY-{random.randint(1000, 9999)}"
        )
        db.add(tx)

    total_amount = max(0.0, round(subtotal + delivery_fee - discount - wallet_deduction, 2))

    order_num = f"KG-{datetime.datetime.now().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
    order = Order(
        order_number=order_num,
        user_id=user.id,
        status="CONFIRMED",
        subtotal=subtotal,
        discount=discount,
        delivery_fee=delivery_fee,
        wallet_deduction=wallet_deduction,
        total_amount=total_amount,
        payment_method=req.payment_method,
        payment_status="PAID",
        delivery_address=req.delivery_address,
        estimated_delivery_minutes=15
    )
    db.add(order)
    await db.flush()

    for c_item, prod in cart_items:
        oi = OrderItem(
            order_id=order.id,
            product_id=prod.id,
            product_name=prod.name,
            price=prod.price,
            quantity=c_item.quantity,
            unit=prod.unit,
            image_url=prod.images[0] if prod.images else None
        )
        db.add(oi)
        # Clear cart item
        await db.delete(c_item)

    await db.commit()
    return {
        "order_id": order.id,
        "order_number": order.order_number,
        "status": order.status,
        "total_amount": order.total_amount,
        "estimated_delivery_minutes": order.estimated_delivery_minutes,
        "message": "Order successfully placed! Live tracking initiated."
    }

@router.get("/orders")
async def get_orders(db: AsyncSession = Depends(get_db)):
    user_res = await db.execute(select(User).limit(1))
    user = user_res.scalars().first()
    if not user:
        return []

    res = await db.execute(
        select(Order).where(Order.user_id == user.id).order_by(desc(Order.created_at)).limit(20)
    )
    orders = res.scalars().all()
    results = []
    for o in orders:
        items_res = await db.execute(select(OrderItem).where(OrderItem.order_id == o.id))
        items = items_res.scalars().all()
        results.append({
            "id": o.id,
            "order_number": o.order_number,
            "status": o.status,
            "total_amount": o.total_amount,
            "created_at": o.created_at.strftime("%d %b %Y, %I:%M %p"),
            "estimated_delivery_minutes": o.estimated_delivery_minutes,
            "items": [
                {
                    "name": i.product_name,
                    "price": i.price,
                    "quantity": i.quantity,
                    "unit": i.unit,
                    "image": i.image_url
                }
                for i in items
            ]
        })
    return results

@router.get("/wallet")
async def get_wallet(db: AsyncSession = Depends(get_db)):
    user_res = await db.execute(select(User).limit(1))
    user = user_res.scalars().first()
    if not user:
        return {"balance": 848.0, "transactions": []}

    tx_res = await db.execute(
        select(WalletTransaction).where(WalletTransaction.user_id == user.id).order_by(desc(WalletTransaction.created_at)).limit(20)
    )
    txs = tx_res.scalars().all()
    return {
        "balance": user.wallet_balance,
        "transactions": [
            {
                "id": t.id,
                "amount": t.amount,
                "type": t.transaction_type,
                "description": t.description,
                "reference_id": t.reference_id,
                "date": t.created_at.strftime("%d %b %Y, %I:%M %p")
            }
            for t in txs
        ]
    }
