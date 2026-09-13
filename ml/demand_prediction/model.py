import pandas as pd
from typing import List, Dict, Any

class DemandPredictor:
    def __init__(self, window_size: int = 7):
        """
        Initializes the DemandPredictor.
        :param window_size: Number of days to use for the rolling average.
        """
        self.window_size = window_size

    def predict(self, historical_data: List[Dict[str, Any]], forecast_days: int = 7) -> List[Dict[str, Any]]:
        """
        Predicts future demand using a simple rolling average.
        
        :param historical_data: List of dicts, e.g., [{"date": "2026-09-01", "quantity": 100}, ...]
        :param forecast_days: Number of days into the future to predict.
        :return: List of dicts with predicted dates and quantities.
        """
        if not historical_data:
            return []

        df = pd.DataFrame(historical_data)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')

        # Calculate average daily demand based on the recent window
        recent_avg = df['quantity'].tail(self.window_size).mean()
        if pd.isna(recent_avg):
            recent_avg = 0.0

        last_date = df['date'].iloc[-1]
        predictions = []
        
        for i in range(1, forecast_days + 1):
            next_date = last_date + pd.Timedelta(days=i)
            predictions.append({
                "date": next_date.strftime("%Y-%m-%d"),
                "predicted_demand": round(recent_avg, 2)
            })
            
        return predictions
