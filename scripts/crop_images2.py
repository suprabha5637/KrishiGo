import sys
from PIL import Image

try:
    img_path = "/Users/suprabhakundu/.gemini/antigravity-ide/brain/41ca07f3-945b-497a-ab0b-315110414a78/.user_uploaded/media_1790971236745.jpg"
    img = Image.open(img_path)
    
    # Farmer Portrait (Right side of hero banner)
    img.crop((640, 150, 750, 270)).save("frontend/public/assets/ecommerce/farmer_portrait.png")
    
    # Crate (Center of hero banner)
    img.crop((450, 160, 630, 280)).save("frontend/public/assets/ecommerce/vegetable_crate.png")

    # Bottom Grid 1: Study Essentials
    img.crop((150, 520, 210, 560)).save("frontend/public/assets/ecommerce/study_1.png")
    img.crop((220, 520, 280, 560)).save("frontend/public/assets/ecommerce/study_2.png")
    img.crop((290, 520, 350, 560)).save("frontend/public/assets/ecommerce/study_3.png")

    # Bottom Grid 2: Clothing
    img.crop((380, 520, 440, 560)).save("frontend/public/assets/ecommerce/clothing_1.png")
    img.crop((450, 520, 510, 560)).save("frontend/public/assets/ecommerce/clothing_2.png")
    img.crop((520, 520, 580, 560)).save("frontend/public/assets/ecommerce/clothing_3.png")
    
    # Bottom Grid 3: Pharmacy
    img.crop((680, 520, 740, 560)).save("frontend/public/assets/ecommerce/pharmacy_1.png")
    img.crop((750, 520, 810, 560)).save("frontend/public/assets/ecommerce/pharmacy_2.png")
    img.crop((820, 520, 880, 560)).save("frontend/public/assets/ecommerce/pharmacy_3.png")

    print("Done cropping extra images")
except Exception as e:
    print(e)
