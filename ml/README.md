# KrishiGo ML Pipeline

## Overview

Machine learning modules for demand forecasting, harvest prediction, product recommendations, and future computer vision capabilities.

## Structure

```
ml/
├── demand_prediction/    # Sales demand forecasting
├── harvest_prediction/   # Crop maturity estimation (advisory)
├── recommendation/       # Product recommendation engine
├── computer_vision/      # Future: crop disease, quality grading
├── notebooks/            # Exploratory data analysis
├── datasets/             # Training data (not committed)
└── model_registry/       # Serialized models (not committed)
```

## Setup

```bash
cd ml
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Important Rules

1. Harvest prediction is ADVISORY ONLY — never forces farmer harvesting
2. Demo predictions must be labeled as "DEMO DATA"
3. Never deploy without evaluation metrics
4. AI assistant uses grounded knowledge with safety disclaimers
