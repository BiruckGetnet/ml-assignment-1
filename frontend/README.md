# Iris ML Classifier - Frontend

A modern Next.js 14 frontend application for interacting with the Iris ML classification API.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Running backend API (see backend/README.md)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL to your backend URL

# Run development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🌟 Features

- **Interactive UI**: Beautiful, responsive interface built with Next.js 14 and Tailwind CSS
- **Real-time Model Selection**: Choose between Decision Tree and Logistic Regression
- **Live Predictions**: Get instant flower classification results
- **Visual Feedback**: 
  - Probability distributions with animated bars
  - Color-coded species predictions
  - Confidence scores
- **Quick Examples**: Pre-filled example data for each flower species
- **API Health Check**: Real-time backend status monitoring
- **Model Performance**: View accuracy, F1-score, and other metrics

## 📱 User Interface

### Main Features:
1. **Model Selection Panel**: View and select ML models with their performance metrics
2. **Input Form**: Enter flower measurements (sepal/petal length and width)
3. **Quick Examples**: Load preset values for known flower types
4. **Results Display**: 
   - Predicted species with confidence
   - Probability distribution across all classes
   - Visual progress bars

### Flower Species:
- **Setosa** (Green): Typically smaller petals
- **Versicolor** (Blue): Medium-sized petals
- **Virginica** (Purple): Larger petals

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main application page
│   └── globals.css      # Global styles
├── public/              # Static assets
├── package.json         # Dependencies
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## 🚀 Deployment to Vercel

### Method 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Environment Variables**: 
     - `NEXT_PUBLIC_API_URL`: Your deployed backend URL
6. Click "Deploy"

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Follow the prompts
```

### Environment Variables

After deployment, add these environment variables in Vercel dashboard:

- `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `https://your-api.onrender.com`)

## 🧪 Testing Locally

```bash
# Make sure backend is running on port 8000
cd ../backend
python main.py

# In another terminal, run frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000` and test the application.

## 📝 API Integration

The frontend connects to the FastAPI backend using Axios. The API URL is configurable via environment variables.

### API Endpoints Used:
- `GET /health` - Check API status
- `GET /models` - Fetch available models and their metrics
- `POST /predict` - Make predictions

### Example API Call:
```typescript
const response = await axios.post(`${API_URL}/predict`, {
  features: {
    sepal_length: 5.1,
    sepal_width: 3.5,
    petal_length: 1.4,
    petal_width: 0.2,
  },
  model: 'decision_tree',
});
```

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    },
  },
}
```

### Modify Layout
The main application logic is in `app/page.tsx`. You can customize:
- Form fields
- Result display
- Model selection UI
- Example presets

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend is running
- Check CORS settings in backend
- Verify API URL in `.env.local`

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## 📦 Production Build

```bash
# Create optimized production build
npm run build

# Test production build locally
npm start
```

## 🤝 Integration with Backend

Make sure to update the API URL when deploying:

1. Deploy backend to Render/Railway
2. Get the backend URL
3. Update `NEXT_PUBLIC_API_URL` in Vercel environment variables
4. Redeploy frontend

## 📄 License

MIT License - Feel free to use this project for learning and development.
