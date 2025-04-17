import numpy as np
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
import joblib
import logging
from datetime import datetime

# Initialize FastAPI app
app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://heart-disease-prediction-application.vercel.app"],  # ✅ Match frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Logistic Regression Model
try:
    model = joblib.load("Heart Disease Prediction Model(LR)_model.pkl")
    logger.info("✅ Model loaded successfully.")
except Exception as e:
    logger.error(f"❌ Error loading model: {e}")
    model = None  # Ensure model isn't used if loading fails

# Define feature names
FEATURE_NAMES = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
    'restecg', 'thalach', 'exang', 'oldpeak', 'slope',
    'ca', 'thal'
]

# Define input format
class InputData(BaseModel):
    features: List[float]

# Store predictions (in-memory storage)
prediction_history: List[Dict] = []

# API Route: Predict Heart Disease
@app.post("/predict")
async def predict(data: InputData):
    if model is None:
        logger.error("❌ Model not loaded.")
        return {"error": "Model not loaded. Please check the server logs."}

    try:
        # Ensure 13 features
        if len(data.features) != 13:
            error_msg = f"❌ Expected 13 features, but got {len(data.features)}."
            logger.error(error_msg)
            return {"error": error_msg}

        # Convert input to DataFrame
        input_df = pd.DataFrame([data.features], columns=FEATURE_NAMES)

        # Make prediction
        prediction = model.predict(input_df)[0]
        prediction = int(prediction)  # Ensure it's a Python integer

        # Store the prediction in history
        entry = {
            "timestamp": datetime.now().isoformat(),
            "features": data.features,
            "prediction": prediction
        }
        prediction_history.append(entry)

        logger.info(f"✅ Prediction: {prediction} (Stored in history)")

        return {"prediction": prediction}

    except Exception as e:
        logger.error(f"❌ Prediction error: {e}")
        return {"error": str(e)}

# API Route: Get Prediction History
@app.get("/history")
async def get_history():
    return {"history": prediction_history}

# Health Check Route
@app.get("/")
async def home():
    return {"message": "🏥 Welcome to the Heart Disease Prediction API"}
