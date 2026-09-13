import sys
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

# Ensure we can import from the 'ml' directory at the project root
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../"))
if project_root not in sys.path:
    sys.path.append(project_root)

try:
    from ml.demand_prediction.model import DemandPredictor
    from ml.harvest_prediction.model import HarvestPredictor
    from ml.recommendation.model import RecommendationEngine
except ImportError as e:
    # Fallback if the path structure is different
    raise ImportError(f"Could not import ML models. Ensure the 'ml' directory is in PYTHONPATH. Details: {e}")

router = APIRouter()

# Instantiate models globally for the router to use
demand_predictor = DemandPredictor()
harvest_predictor = HarvestPredictor()
recommendation_engine = RecommendationEngine()

class DemandRequest(BaseModel):
    historical_data: List[Dict[str, Any]]
    forecast_days: int = 7

class HarvestRequest(BaseModel):
    crop_type: str
    planting_date: str

class RecommendationRequest(BaseModel):
    purchased_items: List[str]
    max_recommendations: int = 3

@router.post("/predict-demand", summary="Predict Future Demand")
async def predict_demand(request: DemandRequest):
    try:
        forecast = demand_predictor.predict(request.historical_data, request.forecast_days)
        return {"forecast": forecast}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/predict-harvest", summary="Predict Expected Harvest Date")
async def predict_harvest(request: HarvestRequest):
    try:
        prediction = harvest_predictor.predict(request.crop_type, request.planting_date)
        return prediction
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommendations", summary="Get Product Recommendations")
async def get_recommendations(request: RecommendationRequest):
    try:
        recommendations = recommendation_engine.recommend(request.purchased_items, request.max_recommendations)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
