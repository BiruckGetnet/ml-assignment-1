# Iris Classification API - FastAPI Backend

A FastAPI backend that serves trained ML models (Decision Tree and Logistic Regression) for Iris flower classification.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Trained models in `models/` directory

### Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
# or
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔌 API Endpoints

### Health Check
```bash
GET /health
```

### Get Available Models
```bash
GET /models
```

Response:
```json
[
  {
    "name": "decision_tree",
    "requires_scaling": false,
    "test_accuracy": 0.9667,
    "precision": 0.9722,
    "recall": 0.9667,
    "f1_score": 0.9667
  },
  {
    "name": "logistic_regression",
    "requires_scaling": true,
    "test_accuracy": 1.0,
    "precision": 1.0,
    "recall": 1.0,
    "f1_score": 1.0
  }
]
```

### Make Prediction
```bash
POST /predict
Content-Type: application/json

{
  "features": {
    "sepal_length": 5.1,
    "sepal_width": 3.5,
    "petal_length": 1.4,
    "petal_width": 0.2
  },
  "model": "decision_tree"
}
```

Response:
```json
{
  "prediction": "setosa",
  "prediction_index": 0,
  "probabilities": {
    "setosa": 1.0,
    "versicolor": 0.0,
    "virginica": 0.0
  },
  "model_used": "decision_tree",
  "confidence": 1.0
}
```

### Get Metadata
```bash
GET /metadata
```

## 🧪 Testing with cURL

```bash
# Health check
curl http://localhost:8000/health

# Get models
curl http://localhost:8000/models

# Make prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "features": {
      "sepal_length": 5.1,
      "sepal_width": 3.5,
      "petal_length": 1.4,
      "petal_width": 0.2
    },
    "model": "decision_tree"
  }'
```

## 📁 Project Structure

```
backend/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── models/             # Trained ML models
│   ├── decision_tree_model.pkl
│   ├── logistic_regression_model.pkl
│   ├── scaler.pkl
│   └── metadata.json
└── README.md
```

## 🚀 Deployment

### Deploy to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

See `render.yaml` for automated deployment configuration.

## 🔒 CORS

Currently configured to allow all origins. For production, update the `allow_origins` in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.vercel.app"],
    ...
)
```

## 📝 Environment Variables

Optional environment variables:
- `PORT`: Server port (default: 8000)
- `MODEL_DIR`: Path to models directory (default: ./models)

## 🤝 Integration

This API is designed to work with the frontend React application. Update the API URL in the frontend to point to your deployed backend.
