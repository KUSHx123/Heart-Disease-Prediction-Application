import { useState, useEffect } from "react";
import axios from "axios";

interface PredictionData {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
}

interface PredictionResponse {
  prediction: number;
}

interface PredictionHistory {
  timestamp: string;
  features: number[];
  prediction: number;
}

const Predict = () => {
  const [formData, setFormData] = useState<PredictionData>({
    age: 0,
    sex: 0,
    cp: 0,
    trestbps: 0,
    chol: 0,
    fbs: 0,
    restecg: 0,
    thalach: 0,
    exang: 0,
    oldpeak: 0,
    slope: 0,
    ca: 0,
    thal: 0,
  });

  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<PredictionHistory[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get<{ history: PredictionHistory[] }>("/api/history");
      setHistory(response.data.history.reverse()); // Show latest first
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: Number(value), // Convert input value to number
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    setLoading(true);
    try {
      const response = await axios.post<PredictionResponse>("/api/predict", {
        features: Object.values(formData),
      });

      const predictionValue = response.data.prediction;
      const predictionMessage =
        predictionValue === 1
          ? "🚨 Heart Disease Detected! Please consult a doctor."
          : "✅ No Heart Disease Detected! Keep maintaining a healthy lifestyle.";

      setPrediction(predictionMessage);

      fetchHistory(); // Refresh history after prediction
    } catch (err) {
      console.error("Error fetching prediction:", err);
      setError("Failed to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predict-container">
      <h2 className="title">Heart Disease Prediction</h2>
      <form onSubmit={handleSubmit} className="predict-form">
        {Object.keys(formData).map((key) => (
          <div key={key} className="input-group">
            <label htmlFor={key} className="label">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type="number"
              id={key}
              name={key}
              value={formData[key as keyof PredictionData]}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        ))}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {prediction && (
        <div className="result">
          <h3>Prediction Result:</h3>
          <p>{prediction}</p>
        </div>
      )}

      <h3 className="history-title">Past Predictions</h3>
      <ul className="history-list">
        {history.length > 0 ? (
          history.map((entry, index) => (
            <li key={index} className="history-item">
              <span>{new Date(entry.timestamp).toLocaleString()} - </span>
              <strong>
                {entry.prediction === 1 ? "🚨 Heart Disease Detected" : "✅ No Heart Disease"}
              </strong>
            </li>
          ))
        ) : (
          <p>No past predictions found.</p>
        )}
      </ul>
    </div>
  );
};

export default Predict;
