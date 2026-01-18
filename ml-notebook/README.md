# Machine Learning Notebook - Iris Classification

This notebook contains a complete end-to-end machine learning pipeline for classifying Iris flowers using Decision Tree and Logistic Regression algorithms.

## 🚀 Quick Start

### Option 1: Google Colab (Recommended)
1. Upload `iris_ml_pipeline.ipynb` to Google Colab
2. Run all cells in sequence
3. Download the generated `models` folder

### Option 2: Local Jupyter
```bash
# Install dependencies
pip install jupyter scikit-learn pandas numpy matplotlib seaborn joblib

# Start Jupyter
jupyter notebook iris_ml_pipeline.ipynb
```

## 📊 What's Included

- **Data Exploration**: Visual analysis of the Iris dataset
- **Data Cleaning**: Handling missing values, duplicates, and outliers
- **Feature Engineering**: Standardization and scaling
- **Model Training**: 
  - Decision Tree Classifier
  - Logistic Regression Classifier
- **Evaluation Metrics**:
  - Accuracy, Precision, Recall, F1-Score
  - Cross-validation scores
  - Confusion matrices
  - Classification reports
- **Model Export**: All models saved using joblib

## 📦 Generated Files

After running the notebook, you'll get:
```
models/
├── decision_tree_model.pkl
├── logistic_regression_model.pkl
├── scaler.pkl
└── metadata.json
```

## 🎯 Model Performance

Both models achieve >95% accuracy on the Iris dataset. The notebook includes comprehensive evaluation and comparison visualizations.

## 📝 Features

The models use 4 input features:
- Sepal length (cm)
- Sepal width (cm)
- Petal length (cm)
- Petal width (cm)

And predict 3 classes:
- Setosa
- Versicolor
- Virginica

## 🔗 Next Steps

Use the exported models in the FastAPI backend for real-time predictions!
