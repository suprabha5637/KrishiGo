import sys
from PIL import Image

try:
    img_path = "/Users/suprabhakundu/.gemini/antigravity-ide/brain/41ca07f3-945b-497a-ab0b-315110414a78/.user_uploaded/media_1790971236745.jpg"
    img = Image.open(img_path)
    
    # Coordinates (left, top, right, bottom) - these are guesses, will refine
    # Hero Banner
    img.crop((145, 140, 1010, 290)).save("frontend/public/assets/ecommerce/hero_banner.jpg")
    
    # 4 Promo banners
    img.crop((150, 305, 360, 365)).save("frontend/public/assets/ecommerce/promo_1.jpg")
    img.crop((370, 305, 470, 365)).save("frontend/public/assets/ecommerce/promo_2.jpg")
    img.crop((480, 305, 640, 365)).save("frontend/public/assets/ecommerce/promo_3.jpg")
    img.crop((650, 305, 820, 365)).save("frontend/public/assets/ecommerce/promo_4.jpg")
    img.crop((830, 305, 990, 365)).save("frontend/public/assets/ecommerce/promo_5.jpg")
    
    # Straight from farm
    img.crop((800, 395, 1000, 500)).save("frontend/public/assets/ecommerce/straight_from_farm.jpg")
    
    # Vegetables
    img.crop((150, 410, 220, 460)).save("frontend/public/assets/ecommerce/tomato.png")
    img.crop((230, 410, 300, 460)).save("frontend/public/assets/ecommerce/potato.png")
    img.crop((305, 410, 375, 460)).save("frontend/public/assets/ecommerce/onion.png")
    img.crop((380, 410, 450, 460)).save("frontend/public/assets/ecommerce/carrot.png")
    img.crop((455, 410, 525, 460)).save("frontend/public/assets/ecommerce/capsicum.png")
    img.crop((530, 410, 600, 460)).save("frontend/public/assets/ecommerce/spinach.png")
    img.crop((605, 410, 675, 460)).save("frontend/public/assets/ecommerce/cauliflower.png")
    img.crop((680, 410, 750, 460)).save("frontend/public/assets/ecommerce/brinjal.png")
    
    # Categories (small icons at top)
    categories = ['Fresh Vegetables', 'Fresh Fruits', 'Dairy & Milk', 'Grocery & Staples', 'Snacks & Beverages', 'Meat, Egg & Seafood', 'Bakery & Sweets', 'Study', 'Clothing', 'Pharmacy']
    for i, _ in enumerate(categories):
        left = 150 + i * 75
        img.crop((left, 70, left+50, 120)).save(f"frontend/public/assets/ecommerce/cat_{i}.png")
        
    print("Done cropping")
except Exception as e:
    print(e)
