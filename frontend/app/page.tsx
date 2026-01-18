'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Brain, Flower2, BarChart3, CheckCircle2, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ModelInfo {
  name: string;
  requires_scaling: boolean;
  test_accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
}

interface PredictionResult {
  prediction: string;
  prediction_index: number;
  probabilities: { [key: string]: number };
  model_used: string;
  confidence: number;
}

interface FormData {
  sepal_length: string;
  sepal_width: string;
  petal_length: string;
  petal_width: string;
}

export default function Home() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('decision_tree');
  const [formData, setFormData] = useState<FormData>({
    sepal_length: '5.1',
    sepal_width: '3.5',
    petal_length: '1.4',
    petal_width: '0.2',
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check API health on mount
  useEffect(() => {
    checkApiHealth();
    fetchModels();
  }, []);

  const checkApiHealth = async () => {
    try {
      await axios.get(`${API_URL}/health`);
      setApiStatus('online');
    } catch (err) {
      setApiStatus('offline');
      setError('Backend API is offline. Please start the backend server.');
    }
  };

  const fetchModels = async () => {
    try {
      const response = await axios.get(`${API_URL}/models`);
      setModels(response.data);
    } catch (err) {
      console.error('Error fetching models:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePresetExample = (example: 'setosa' | 'versicolor' | 'virginica') => {
    const presets = {
      setosa: { sepal_length: '5.1', sepal_width: '3.5', petal_length: '1.4', petal_width: '0.2' },
      versicolor: { sepal_length: '6.3', sepal_width: '2.9', petal_length: '4.7', petal_width: '1.4' },
      virginica: { sepal_length: '7.2', sepal_width: '3.0', petal_length: '5.8', petal_width: '1.6' },
    };
    setFormData(presets[example]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post(`${API_URL}/predict`, {
        features: {
          sepal_length: parseFloat(formData.sepal_length),
          sepal_width: parseFloat(formData.sepal_width),
          petal_length: parseFloat(formData.petal_length),
          petal_width: parseFloat(formData.petal_width),
        },
        model: selectedModel,
      });
      setPrediction(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred during prediction');
    } finally {
      setLoading(false);
    }
  };

  const getSpeciesColor = (species: string) => {
    const colors: { [key: string]: string } = {
      setosa: 'text-green-600 bg-green-100',
      versicolor: 'text-blue-600 bg-blue-100',
      virginica: 'text-purple-600 bg-purple-100',
    };
    return colors[species.toLowerCase()] || 'text-gray-600 bg-gray-100';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Flower2 className="w-12 h-12 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Iris ML Classifier
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-4">
            Machine Learning powered flower classification
          </p>
          
          {/* API Status */}
          <div className="flex justify-center items-center gap-2">
            {apiStatus === 'checking' && (
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking API...
              </span>
            )}
            {apiStatus === 'online' && (
              <span className="text-sm text-green-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                API Online
              </span>
            )}
            {apiStatus === 'offline' && (
              <span className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                API Offline
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Model Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Models</h2>
              </div>
              
              {models.length === 0 ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Loading models...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {models.map((model) => (
                    <div
                      key={model.name}
                      onClick={() => setSelectedModel(model.name)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        selectedModel === model.name
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 capitalize">
                          {model.name.replace('_', ' ')}
                        </h3>
                        {selectedModel === model.name && (
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Accuracy:</span>
                          <span className="font-medium text-gray-800">
                            {(model.test_accuracy * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">F1-Score:</span>
                          <span className="font-medium text-gray-800">
                            {(model.f1_score * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Examples */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Examples</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handlePresetExample('setosa')}
                  className="w-full px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors text-left border border-green-200"
                >
                  <span className="font-medium">Setosa</span>
                  <span className="text-sm block text-green-600">Small petals</span>
                </button>
                <button
                  onClick={() => handlePresetExample('versicolor')}
                  className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-left border border-blue-200"
                >
                  <span className="font-medium">Versicolor</span>
                  <span className="text-sm block text-blue-600">Medium petals</span>
                </button>
                <button
                  onClick={() => handlePresetExample('virginica')}
                  className="w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors text-left border border-purple-200"
                >
                  <span className="font-medium">Virginica</span>
                  <span className="text-sm block text-purple-600">Large petals</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Input Form and Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Flower Measurements</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sepal Length (cm)
                    </label>
                    <input
                      type="number"
                      name="sepal_length"
                      value={formData.sepal_length}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      max="10"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="e.g., 5.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sepal Width (cm)
                    </label>
                    <input
                      type="number"
                      name="sepal_width"
                      value={formData.sepal_width}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      max="10"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="e.g., 3.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Petal Length (cm)
                    </label>
                    <input
                      type="number"
                      name="petal_length"
                      value={formData.petal_length}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      max="10"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="e.g., 1.4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Petal Width (cm)
                    </label>
                    <input
                      type="number"
                      name="petal_width"
                      value={formData.petal_width}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      max="10"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="e.g., 0.2"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || apiStatus === 'offline'}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Classifying...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5" />
                      Classify Flower
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            {prediction && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Prediction Results</h2>
                </div>

                {/* Main Prediction */}
                <div className="mb-8">
                  <div className={`inline-block px-6 py-3 rounded-full ${getSpeciesColor(prediction.prediction)} text-2xl font-bold capitalize mb-2`}>
                    {prediction.prediction}
                  </div>
                  <p className="text-gray-600 text-sm">
                    Model: <span className="font-medium capitalize">{prediction.model_used.replace('_', ' ')}</span>
                    {' '} | Confidence: <span className="font-medium">{(prediction.confidence * 100).toFixed(2)}%</span>
                  </p>
                </div>

                {/* Probabilities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Class Probabilities</h3>
                  <div className="space-y-4">
                    {Object.entries(prediction.probabilities).map(([species, prob]) => (
                      <div key={species}>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700 capitalize font-medium">{species}</span>
                          <span className="text-gray-900 font-bold">{(prob * 100).toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              species === 'setosa' ? 'bg-green-500' :
                              species === 'versicolor' ? 'bg-blue-500' :
                              'bg-purple-500'
                            }`}
                            style={{ width: `${prob * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Built with FastAPI, Next.js, and scikit-learn</p>
          <p className="mt-1">Decision Tree & Logistic Regression Models</p>
        </div>
      </div>
    </main>
  );
}
