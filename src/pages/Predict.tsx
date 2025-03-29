import { useState } from "react";
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
  prediction: string;
  confidence?: number;
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
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    setConfidence(null);
  
    // Validation rules
    const validationErrors: string[] = [];
    if (formData.age <= 0 || formData.age > 120) validationErrors.push("Age must be between 1 and 120.");
    if (formData.chol <= 0) validationErrors.push("Cholesterol must be a positive value.");
    if (formData.trestbps <= 0) validationErrors.push("Resting Blood Pressure must be a positive value.");
    if (formData.thalach <= 0) validationErrors.push("Max Heart Rate must be a positive value.");
    if (formData.oldpeak < 0) validationErrors.push("ST Depression cannot be negative.");
  
    // Check if all fields have valid inputs
    if (Object.values(formData).some((val) => val === 0)) {
      validationErrors.push("All fields must be filled with valid values (0 is not allowed).");
    }
  
    // If errors exist, show them
    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post<PredictionResponse>("/api/predict", formData);
      
      // Ensure `prediction` is treated as a number
      const predictionValue = Number(response.data.prediction);
  
      // Map prediction to user-friendly message
      const predictionMessage =
        predictionValue === 1
          ? "🚨 Heart Disease Detected! Please consult a doctor."
          : "✅ No Heart Disease Detected! Keep maintaining a healthy lifestyle.";
  
      setPrediction(predictionMessage);
      setConfidence(response.data.confidence ?? null);
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
          {confidence !== null && <p>Confidence: {confidence.toFixed(2)}%</p>}
        </div>
      )}
    </div>
  );
};

export default Predict;
