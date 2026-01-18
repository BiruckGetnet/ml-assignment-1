from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import json
from pathlib import Path
from typing import List, Dict

# Initialize FastAPI app
app = FastAPI(
    title="Iris Classification API",
    description="ML API for Iris flower classification using Decision Tree and Logistic Regression",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and metadata
MODEL_DIR = Path(__file__).parent / "models"

try:
    # Load models
    dt_model = joblib.load(MODEL_DIR / "decision_tree_model.pkl")
    lr_model = joblib.load(MODEL_DIR / "logistic_regression_model.pkl")
    scaler = joblib.load(MODEL_DIR / "scaler.pkl")
    
    # Load metadata
    with open(MODEL_DIR / "metadata.json", "r") as f:
        metadata = json.load(f)
    
    print("✓ Models loaded successfully!")
except Exception as e:
    print(f"Error loading models: {e}")
    dt_model = lr_model = scaler = metadata = None


# Pydantic models for request/response
class IrisFeatures(BaseModel):
    sepal_length: float = Field(..., description="Sepal length in cm", ge=0, le=10)
    sepal_width: float = Field(..., description="Sepal width in cm", ge=0, le=10)
    petal_length: float = Field(..., description="Petal length in cm", ge=0, le=10)
    petal_width: float = Field(..., description="Petal width in cm", ge=0, le=10)
    
    class Config:
        schema_extra = {
            "example": {
                "sepal_length": 5.1,
                "sepal_width": 3.5,
                "petal_length": 1.4,
                "petal_width": 0.2
            }
        }


class PredictionRequest(BaseModel):
    features: IrisFeatures
    model: str = Field(..., description="Model to use: 'decision_tree' or 'logistic_regression'")
    
    class Config:
        schema_extra = {
            "example": {
                "features": {
                    "sepal_length": 5.1,
                    "sepal_width": 3.5,
                    "petal_length": 1.4,
                    "petal_width": 0.2
                },
                "model": "decision_tree"
            }
        }


class PredictionResponse(BaseModel):
    prediction: str
    prediction_index: int
    probabilities: Dict[str, float]
    model_used: str
    confidence: float


class ModelInfo(BaseModel):
    name: str
    requires_scaling: bool
    test_accuracy: float
    precision: float
    recall: float
    f1_score: float


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Iris Classification API",
        "version": "1.0.0",
        "endpoints": {
            "predict": "/predict",
            "models": "/models",
            "metadata": "/metadata",
            "health": "/health"
        }
    }


# Health check
@app.get("/health")
async def health_check():
    if dt_model is None or lr_model is None:
        raise HTTPException(status_code=503, detail="Models not loaded")
    return {
        "status": "healthy",
        "models_loaded": True
    }


# Get available models and their info
@app.get("/models", response_model=List[ModelInfo])
async def get_models():
    if metadata is None:
        raise HTTPException(status_code=503, detail="Metadata not loaded")
    
    models_info = []
    for model_name, model_data in metadata["models"].items():
        metrics = model_data["metrics"]
        models_info.append(ModelInfo(
            name=model_name,
            requires_scaling=model_data["requires_scaling"],
            test_accuracy=metrics["test_accuracy"],
            precision=metrics["precision"],
            recall=metrics["recall"],
            f1_score=metrics["f1_score"]
        ))
    
    return models_info


# Get metadata
@app.get("/metadata")
async def get_metadata():
    if metadata is None:
        raise HTTPException(status_code=503, detail="Metadata not loaded")
    return metadata


# Prediction endpoint
@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    if dt_model is None or lr_model is None:
        raise HTTPException(status_code=503, detail="Models not loaded")
    
    # Extract features
    features_array = np.array([[
        request.features.sepal_length,
        request.features.sepal_width,
        request.features.petal_length,
        request.features.petal_width
    ]])
    
    try:
        # Select model
        if request.model == "decision_tree":
            model = dt_model
            features_to_use = features_array
        elif request.model == "logistic_regression":
            model = lr_model
            features_to_use = scaler.transform(features_array)
        else:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid model: {request.model}. Choose 'decision_tree' or 'logistic_regression'"
            )
        
        # Make prediction
        prediction_idx = int(model.predict(features_to_use)[0])
        probabilities = model.predict_proba(features_to_use)[0]
        
        # Get class names
        target_names = metadata["target_names"]
        prediction_name = target_names[prediction_idx]
        
        # Create probability dictionary
        prob_dict = {name: float(prob) for name, prob in zip(target_names, probabilities)}
        
        # Calculate confidence (max probability)
        confidence = float(max(probabilities))
        
        return PredictionResponse(
            prediction=prediction_name,
            prediction_index=prediction_idx,
            probabilities=prob_dict,
            model_used=request.model,
            confidence=confidence
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


# Batch prediction endpoint
@app.post("/predict/batch")
async def predict_batch(requests: List[PredictionRequest]):
    results = []
    for req in requests:
        try:
            result = await predict(req)
            results.append({"success": True, "result": result})
        except HTTPException as e:
            results.append({"success": False, "error": e.detail})
    return results


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
