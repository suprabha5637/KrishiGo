from datetime import datetime, timedelta
from typing import Dict, Any

class HarvestPredictor:
    # Baseline days to harvest for common crops
    CROP_CYCLES = {
        "wheat": 120,
        "rice": 130,
        "corn": 90,
        "tomato": 75,
        "potato": 100,
        "onion": 110,
        "cotton": 150,
        "sugarcane": 365,
    }

    def predict(self, crop_type: str, planting_date: str) -> Dict[str, Any]:
        """
        Predicts expected harvest date based on crop type and planting date.
        
        :param crop_type: The name of the crop.
        :param planting_date: The date the crop was planted (YYYY-MM-DD).
        :return: Dictionary containing harvest estimates.
        """
        crop_type_lower = crop_type.lower()
        days_to_harvest = self.CROP_CYCLES.get(crop_type_lower, 90) # Default to 90 days if unknown

        plant_dt = datetime.strptime(planting_date, "%Y-%m-%d")
        harvest_dt = plant_dt + timedelta(days=days_to_harvest)

        return {
            "crop_type": crop_type,
            "planting_date": planting_date,
            "expected_harvest_date": harvest_dt.strftime("%Y-%m-%d"),
            "estimated_days_to_harvest": days_to_harvest
        }
