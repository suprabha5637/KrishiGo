import sys
from PIL import Image

try:
    img_path = "/Users/suprabhakundu/.gemini/antigravity-ide/brain/41ca07f3-945b-497a-ab0b-315110414a78/.user_uploaded/media_1790971236745.jpg"
    img = Image.open(img_path)
    
    # Study
    img.crop((150, 520, 185, 560)).save("frontend/public/assets/ecommerce/study_1.png")
    img.crop((190, 520, 225, 560)).save("frontend/public/assets/ecommerce/study_2.png")
    img.crop((230, 520, 265, 560)).save("frontend/public/assets/ecommerce/study_3.png")
    img.crop((270, 520, 305, 560)).save("frontend/public/assets/ecommerce/study_4.png")
    img.crop((310, 520, 345, 560)).save("frontend/public/assets/ecommerce/study_5.png")
    img.crop((350, 520, 385, 560)).save("frontend/public/assets/ecommerce/study_6.png")

    # Clothing
    img.crop((420, 520, 455, 560)).save("frontend/public/assets/ecommerce/clothing_1.png")
    img.crop((460, 520, 495, 560)).save("frontend/public/assets/ecommerce/clothing_2.png")
    img.crop((500, 520, 535, 560)).save("frontend/public/assets/ecommerce/clothing_3.png")
    img.crop((540, 520, 575, 560)).save("frontend/public/assets/ecommerce/clothing_4.png")
    img.crop((580, 520, 615, 560)).save("frontend/public/assets/ecommerce/clothing_5.png")
    img.crop((620, 520, 655, 560)).save("frontend/public/assets/ecommerce/clothing_6.png")
    
    # Pharmacy
    img.crop((700, 520, 735, 560)).save("frontend/public/assets/ecommerce/pharmacy_1.png")
    img.crop((740, 520, 775, 560)).save("frontend/public/assets/ecommerce/pharmacy_2.png")
    img.crop((780, 520, 815, 560)).save("frontend/public/assets/ecommerce/pharmacy_3.png")
    img.crop((820, 520, 855, 560)).save("frontend/public/assets/ecommerce/pharmacy_4.png")
    img.crop((860, 520, 895, 560)).save("frontend/public/assets/ecommerce/pharmacy_5.png")
    img.crop((900, 520, 935, 560)).save("frontend/public/assets/ecommerce/pharmacy_6.png")

    print("Done cropping 6x grids")
except Exception as e:
    print(e)
