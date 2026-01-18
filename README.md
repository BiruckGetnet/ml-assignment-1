# 🌸 Iris ML Classification - Complete End-to-End Project

A full-stack machine learning application for classifying Iris flowers using **Decision Tree** and **Logistic Regression** models. This project includes a Jupyter notebook for model training, a FastAPI backend, and a modern Next.js frontend.

## 📋 Project Overview

This project demonstrates:
- ✅ End-to-end ML pipeline (data cleaning → training → evaluation → export)
- ✅ Two classification models: Decision Tree and Logistic Regression
- ✅ RESTful API backend with FastAPI
- ✅ Modern, responsive web interface with Next.js
- ✅ Model export using joblib
- ✅ Deployment-ready configuration

## 🏗️ Project Structure

```
.
├── ml-notebook/                 # Jupyter notebook & models
│   ├── iris_ml_pipeline.ipynb  # Complete ML pipeline
│   ├── README.md               # Notebook documentation
│   └── models/                 # Exported models (generated)
│       ├── decision_tree_model.pkl
│       ├── logistic_regression_model.pkl
│       ├── scaler.pkl
│       └── metadata.json
│
├── backend/                    # FastAPI backend
│   ├── main.py                # API implementation
│   ├── requirements.txt       # Python dependencies
│   ├── render.yaml           # Render deployment config
│   ├── models/               # Copy models here from notebook
│   └── README.md
│
├── frontend/                  # Next.js frontend
│   ├── app/
│   │   ├── page.tsx         # Main application
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── package.json
│   ├── vercel.json          # Vercel deployment config
│   └── README.md
│
└── README.md                 # This file
```

## 🚀 Quick Start Guide

### Step 1: Train Models (Jupyter Notebook)

```bash
# Option A: Google Colab (Recommended)
1. Upload ml-notebook/iris_ml_pipeline.ipynb to Google Colab
2. Run all cells
3. Download the generated 'models' folder

# Option B: Local Jupyter
cd ml-notebook
pip install jupyter scikit-learn pandas numpy matplotlib seaborn joblib
jupyter notebook iris_ml_pipeline.ipynb
# Run all cells
```

**Output**: `models/` folder with 4 files:
- `decision_tree_model.pkl`
- `logistic_regression_model.pkl`
- `scaler.pkl`
- `metadata.json`

### Step 2: Set Up Backend

```bash
# Copy trained models to backend
cp -r ml-notebook/models backend/

# Install dependencies
cd backend
pip install -r requirements.txt

# Run the API server
python main.py
# or
uvicorn main:app --reload
```

Backend will be available at `http://localhost:8000`

**Test it**:
```bash
curl http://localhost:8000/health
```

### Step 3: Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local if needed (default: http://localhost:8000)

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 🌐 Deployment

### Backend Deployment (Render)

1. **Create GitHub Repository for Backend**:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-backend-repo-url>
   git push -u origin main
   ```

2. **Deploy to Render**:
   - Go to [Render Dashboard](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `iris-ml-api`
     - **Environment**: `Python 3`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
     - **Plan**: Free
   - Click "Create Web Service"
   - **Important**: Upload the `models/` folder manually or commit it to your repo

3. **Get your backend URL**: `https://your-app.onrender.com`

### Frontend Deployment (Vercel)

1. **Create GitHub Repository for Frontend**:
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-frontend-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your frontend repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `./` (or `frontend` if in monorepo)
     - **Environment Variables**:
       - `NEXT_PUBLIC_API_URL` = `https://your-app.onrender.com`
   - Click "Deploy"

3. **Get your frontend URL**: `https://your-app.vercel.app`

## 📊 Model Performance

| Model | Accuracy | Precision | Recall | F1-Score |
|-------|----------|-----------|--------|----------|
| Decision Tree | ~96-97% | ~97% | ~97% | ~97% |
| Logistic Regression | ~100% | ~100% | ~100% | ~100% |

*Note: Results may vary slightly based on train/test split*

## 🎯 Features

### ML Notebook
- Complete data exploration and visualization
- Data cleaning and preprocessing
- Feature scaling (StandardScaler)
- Model training and hyperparameter tuning
- Comprehensive evaluation metrics
- Cross-validation
- Confusion matrices
- Model export with metadata

### Backend API
- RESTful API with FastAPI
- Model loading and caching
- Input validation with Pydantic
- CORS enabled
- Interactive API docs (Swagger UI)
- Health check endpoint
- Batch prediction support

### Frontend
- Beautiful, responsive UI
- Real-time model selection
- Interactive prediction form
- Visual probability distributions
- Quick example presets
- API health monitoring
- Animated transitions

## 📚 API Documentation

Once backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

#### Make Prediction
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

## 🛠️ Technology Stack

### ML & Backend
- **Python 3.8+**
- **scikit-learn**: ML models
- **FastAPI**: Web framework
- **Pydantic**: Data validation
- **joblib**: Model serialization
- **uvicorn**: ASGI server

### Frontend
- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **Lucide React**: Icons

### Deployment
- **Render**: Backend hosting (free tier)
- **Vercel**: Frontend hosting (free tier)
- **GitHub**: Version control

## 📖 Usage Examples

### Example 1: Setosa (Small Petals)
```
Sepal Length: 5.1 cm
Sepal Width: 3.5 cm
Petal Length: 1.4 cm
Petal Width: 0.2 cm
→ Prediction: Setosa
```

### Example 2: Versicolor (Medium Petals)
```
Sepal Length: 6.3 cm
Sepal Width: 2.9 cm
Petal Length: 4.7 cm
Petal Width: 1.4 cm
→ Prediction: Versicolor
```

### Example 3: Virginica (Large Petals)
```
Sepal Length: 7.2 cm
Sepal Width: 3.0 cm
Petal Length: 5.8 cm
Petal Width: 1.6 cm
→ Prediction: Virginica
```

## 🧪 Testing

### Test Backend Locally
```bash
# Test health
curl http://localhost:8000/health

# Test models endpoint
curl http://localhost:8000/models

# Test prediction
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

### Test Frontend
1. Start backend on port 8000
2. Start frontend on port 3000
3. Open browser to `http://localhost:3000`
4. Try the quick examples or enter custom values

## 📦 Deliverables Checklist

- ✅ **ML Notebook**: `ml-notebook/iris_ml_pipeline.ipynb`
  - Complete pipeline from data cleaning to model export
  - Uses Decision Tree and Logistic Regression
  - Models exported with joblib

- ✅ **Backend API**: `backend/`
  - FastAPI implementation
  - Model integration
  - Deployment configuration

- ✅ **Frontend**: `frontend/`
  - Interactive UI
  - Model selection
  - Real-time predictions
  - Deployment configuration

- ✅ **Documentation**: README files in each directory

## 🔗 Repository Links

After deployment, you'll have:

1. **Notebook Repository**: `https://github.com/yourusername/iris-ml-notebook`
2. **Backend Repository**: `https://github.com/yourusername/iris-ml-backend`
3. **Frontend Repository**: `https://github.com/yourusername/iris-ml-frontend`

Or use a monorepo:
- **Monorepo**: `https://github.com/yourusername/iris-ml-fullstack`

## 🌐 Deployed Application Links

After deployment:

1. **Backend API**: `https://your-backend.onrender.com`
   - API Docs: `https://your-backend.onrender.com/docs`

2. **Frontend App**: `https://your-frontend.vercel.app`

## 🐛 Troubleshooting

### Models Not Loading
```bash
# Ensure models are in backend/models/
ls backend/models/
# Should show: decision_tree_model.pkl, logistic_regression_model.pkl, scaler.pkl, metadata.json
```

### CORS Errors
Update `backend/main.py` with your frontend URL:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    ...
)
```

### Port Already in Use
```bash
# Backend
uvicorn main:app --port 8001

# Frontend
npm run dev -- -p 3001
```

## 📝 Next Steps

1. **Train the models** using the Jupyter notebook
2. **Set up and test** backend locally
3. **Set up and test** frontend locally
4. **Create GitHub repositories** for each component
5. **Deploy backend** to Render
6. **Deploy frontend** to Vercel with backend URL
7. **Test the deployed** application

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

MIT License - Free to use for learning and development.

## 👨‍💻 Author

Built as a complete ML deployment demonstration project.

---

**Ready to deploy?** Follow the deployment steps above and share your links! 🚀
