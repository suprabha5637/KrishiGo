import sys
from PIL import Image

try:
    img_path = "/Users/suprabhakundu/.gemini/antigravity-ide/brain/41ca07f3-945b-497a-ab0b-315110414a78/.user_uploaded/media_1790971236745.jpg"
    img = Image.open(img_path)
    
    # In the reference image, the top categories row spans from X ~ 140 to ~ 980
    # There are 15 items in this row (14 categories + "All Categories" button)
    # 980 - 140 = 840. 840 / 15 = 56 pixels apart.
    
    start_x = 145
    width = 50
    spacing = 58
    
    for i in range(14):
        left = start_x + (i * spacing)
        img.crop((left, 70, left+width, 120)).save(f"frontend/public/assets/ecommerce/cat_icon_{i}.png")
    
    print("Done cropping category icons")
except Exception as e:
    print(e)
