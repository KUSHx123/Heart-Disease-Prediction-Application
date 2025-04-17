import { useState } from "react";

const API_URL = (import.meta.env.VITE_API_URL || "https://fastapi-heart-backend-production.up.railway.app").trim();

const PredictionComponent = () => {
  const featureLabels = [
    "Age", "Sex", "Chest Pain Type", "Resting Blood Pressure",
    "Cholesterol", "Fasting Blood Sugar", "Resting ECG",
    "Max Heart Rate", "Exercise Induced Angina", "ST Depression",
    "Slope", "Number of Major Vessels", "Thalassemia"
  ];

  const [features, setFeatures] = useState<string[]>(new Array(13).fill(""));
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle input changes
  const handleChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    setFormError(null); // Clear error when user starts typing
  };

  // Validate form before submission
  const validateForm = () => {
    if (features.some((value) => value.trim() === "")) {
      return "All fields must be filled.";
    }
    if (+features[0] <= 0 || +features[0] > 120) return "Age must be between 1 and 120.";
    if (+features[4] <= 0) return "Cholesterol must be a positive value.";
    if (+features[3] <= 0) return "Resting Blood Pressure must be a positive value.";
    if (+features[7] <= 0) return "Max Heart Rate must be a positive value.";
    if (+features[9] < 0) return "ST Depression cannot be negative.";

    return null;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setPrediction(null);
    setError(null);
    setFormError(null);

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setLoading(true);
    try {
      console.log("Sending request with features:", features.map(Number));

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: features.map(Number) }),
      });

      console.log("Response received:", response);

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      console.log("API Response:", data);

      if (data.error) throw new Error(data.error);

      // Convert prediction to user-friendly message
      const predictionMessage =
        Number(data.prediction) === 1
          ? "🚨 Heart Disease Detected! Please consult a doctor."
          : "✅ No Heart Disease Detected! Keep maintaining a healthy lifestyle.";

      setPrediction(predictionMessage);
    } catch (err: any) {
      console.error("Fetch Error:", err.message);
      setError("Error fetching prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold text-gray-700">Heart Disease Prediction Tool...!</h2>

      {featureLabels.map((label, index) => (
        <div key={index} className="my-2">
          <label className="block text-gray-600">{label}:</label>
          <input
            type="number"
            min="0"
            className="border rounded p-2 w-full"
            value={features[index]}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        </div>
      ))}

      {formError && <p className="text-red-500 mt-2">{formError}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`p-2 mt-4 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Predicting..." : "Predict"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {prediction && <p className="text-green-600 mt-2">{prediction}</p>}
    </div>
  );
};

export default PredictionComponent;
