import { useState } from "react";
import { supabase } from "../lib/supabase"; 
import { useAuth } from "../context/AuthContext"; 

const API_URL = (import.meta.env.VITE_API_URL || "https://fastapi-heart-backend-production.up.railway.app").trim();

const PredictionComponent = () => {
  const featureLabels = [
    "Age", "Sex", "Chest Pain Type", "Resting Blood Pressure",
    "Cholesterol", "Fasting Blood Sugar", "Resting ECG",
    "Max Heart Rate", "Exercise Induced Angina", "ST Depression",
    "ST Slope", "Number of Major Vessels", "Thalassemia"
  ];

  const [features, setFeatures] = useState<string[]>(new Array(13).fill(""));
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth();

  const handleChange = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
    setFormError(null);
  };

  const validateForm = () => {
    if (features.some(val => val.trim() === "")) return "All fields must be filled.";
    if (+features[0] <= 0 || +features[0] > 120) return "Age must be between 1 and 120.";
    if (+features[4] <= 0) return "Cholesterol must be a positive value.";
    if (+features[3] <= 0) return "Resting Blood Pressure must be a positive value.";
    if (+features[7] <= 0) return "Max Heart Rate must be a positive value.";
    if (+features[9] < 0) return "ST Depression cannot be negative.";
    return null;
  };

  const handleSubmit = async () => {
    setPrediction(null);
    setError(null);
    setFormError(null);

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (!user) {
      setError("⚠️ Please log in to make predictions.");
      return;
    }

    setLoading(true);

    try {
      const featureNumbers = features.map(Number);
      const endpoint = API_URL.endsWith("/") ? `${API_URL}predict` : `${API_URL}/predict`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: featureNumbers }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const predictionValue = Number(data.prediction);

      setPrediction(
        predictionValue === 1
          ? "🚨 Heart Disease Detected! Please consult a doctor."
          : "✅ No Heart Disease Detected! Keep maintaining a healthy lifestyle."
      );

      // ✅ Insert into Supabase
      const { error: insertError } = await supabase.from("predictions").insert([
        {
          user_id: user.id,
          age: featureNumbers[0],
          sex: featureNumbers[1],
          chest_pain_type: featureNumbers[2],
          resting_blood_pressure: featureNumbers[3],
          cholesterol: featureNumbers[4],
          fasting_blood_sugar: featureNumbers[5],
          resting_ecg: featureNumbers[6],
          max_heart_rate: featureNumbers[7],
          exercise_angina: featureNumbers[8],
          st_depression: featureNumbers[9],
          st_slope: featureNumbers[10],
          num_vessels: featureNumbers[11],
          thalassemia: featureNumbers[12],
          result: { prediction: predictionValue },
        },
      ]);

      if (insertError) {
        console.error("❌ Supabase insert error:", insertError.message);
      } else {
        console.log("✅ Prediction inserted successfully.");
      }
    } catch (err: any) {
      console.error("❌ Prediction error:", err.message);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Heart Disease Prediction Tool</h2>

      {featureLabels.map((label, idx) => (
        <div key={idx} className="mb-3">
          <label className="block text-sm text-gray-600 font-medium">
            {label}:
          </label>
          <input
            type="number"
            min="0"
            className="border rounded p-2 w-full"
            value={features[idx]}
            onChange={(e) => handleChange(idx, e.target.value)}
            required
          />
        </div>
      ))}

      {formError && <p className="text-red-500 mt-2">{formError}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-4 px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Predicting..." : "Predict"}
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}
      {prediction && <p className="text-green-600 mt-3 font-medium">{prediction}</p>}
    </div>
  );
};

export default PredictionComponent;
