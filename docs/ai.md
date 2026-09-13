# KrishiGo AI/ML Documentation

## Overview

KrishiGo uses machine learning for:
1. **Demand Forecasting** — Predicting product demand
2. **Harvest Prediction** — Estimating crop maturity (advisory only)
3. **Product Recommendations** — Personalized product suggestions
4. **Computer Vision** — Future: crop disease detection, quality grading

## Important Rules

- Harvest prediction is **advisory only** — never forces harvesting
- Demo data must be clearly labeled as "DEMO DATA"
- Never deploy a model without evaluation metrics
- AI assistant must not invent agricultural facts
- Use safety disclaimers for high-impact recommendations

## Module Structure

```
ml/
├── demand_prediction/
│   ├── data_preprocessing.py
│   ├── feature_engineering.py
│   ├── train.py
│   ├── evaluate.py
│   ├── inference.py
│   └── README.md
├── harvest_prediction/
│   ├── crop_models.py
│   ├── train.py
│   ├── inference.py
│   └── README.md
├── recommendation/
│   ├── collaborative_filtering.py
│   ├── content_based.py
│   ├── popular_items.py
│   └── README.md
├── computer_vision/
│   ├── README.md  (placeholder)
│   └── TODO.md
├── notebooks/
│   ├── eda_demand.ipynb
│   └── eda_products.ipynb
├── datasets/
│   └── .gitkeep
└── model_registry/
    └── .gitkeep
```

## Demand Forecasting

### Inputs
- Historical sales data
- Product, location, date
- Season, day of week
- Price, promotions
- Festival/holiday signals
- Weather (when available)
- Inventory levels
- Bulk demand

### Models
1. **Baseline**: Moving average, exponential smoothing
2. **ML**: XGBoost / LightGBM regression
3. **Future**: LSTM / Transformer for time-series

### Metrics
- MAE (Mean Absolute Error)
- RMSE (Root Mean Squared Error)
- MAPE (Mean Absolute Percentage Error)

### Output
- Expected daily/weekly demand per product per location
- Confidence interval
- Recommended procurement quantity
- Stock risk assessment (shortage/overstock)

## Harvest Prediction

### Inputs
- Crop type and variety
- Planting date
- Location (latitude, longitude)
- Growing conditions
- Current crop stage

### Output
- Estimated maturity date
- Harvest window (start → end)
- Confidence percentage
- Key factors affecting prediction

### Important
This is **ADVISORY ONLY**. It must NOT create forced harvest orders.

## Recommendations

### Initial Methods
1. **Popular Products** — Most purchased in location
2. **Category Similarity** — Products from same/related categories
3. **Recently Viewed** — User browsing history
4. **Frequently Bought Together** — Co-purchase analysis
5. **User History** — Based on past purchases

### Sections
- "Popular Near You"
- "Fresh Picks"
- "Frequently Bought Together"
- "Recommended For You"
- "Farmer Store Picks"
- "Bulk-Friendly Products"

## AI Farming Assistant

### Architecture
```
User Question → Intent Detection → Knowledge Retrieval
→ Validated Rules/Data → AI Response → Safety Disclaimer
```

### Capabilities
- Crop guidance
- Planting and irrigation advice
- Nutrient recommendations
- Pest/disease identification
- Crop stage guidance
- Demand information

### Safety
- Grounded in validated agricultural knowledge
- Safety disclaimers for high-impact recommendations
- Never invents facts
- Defers to professional advice when appropriate

## Computer Vision (Future)

### Planned Features
- Crop disease detection from leaf images
- Fruit/vegetable quality grading
- Image-based crop analysis

### Technology
- OpenCV for image preprocessing
- PyTorch for deep learning models
- Pre-trained models (ResNet, EfficientNet) for transfer learning

### Status: PLACEHOLDER — Requires validated datasets before production use
