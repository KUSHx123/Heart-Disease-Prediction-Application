import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import axios from "axios";

interface PredictionData {
  age: number;
  sex: number;
  chest_pain_type: number;
  resting_blood_pressure: number;
  cholesterol: number;
  fasting_blood_sugar: number;
  resting_ecg: number;
  max_heart_rate: number;
  exercise_angina: number;
  st_depression: number;
  st_slope: number;
  num_vessels: number;
  thalassemia: number;
}

interface PredictionResponse {
  prediction: number;
}

interface PredictionHistory {
  id: string;
  prediction: { prediction: number };
  created_at: string;
}

const Predict = () => {
  const [formData, setFormData] = useState<PredictionData>({
    age: 0,
    sex: 0,
    chest_pain_type: 0,
    resting_blood_pressure: 0,
    cholesterol: 0,
    fasting_blood_sugar: 0,
    resting_ecg: 0,
    max_heart_rate: 0,
    exercise_angina: 0,
    st_depression: 0,
    st_slope: 0,
    num_vessels: 0,
    thalassemia: 0,
  });

  const [user, setUser] = useState<any>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionHistory[]>([]);

  // Fetch current Supabase user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    fetchUser();
  }, []);

  // Fetch prediction history for authenticated user
  useEffect(() => {
    if (user) fetchPredictionHistory();
  }, [user]);

  const fetchPredictionHistory = async () => {
    const { data, error } = await supabase
      .from("predictions")
      .select("id, prediction, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setPredictionHistory(data);
    if (error) console.error("❌ Error fetching history:", error.message);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrediction(null);
    setError(null);

    if (!user) {
      setError("⚠️ Please log in to use the prediction tool.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Call FastAPI backend
      const response = await axios.post<PredictionResponse>("/api/predict", {
        features: Object.values(formData),
      });

      const predictionValue = response.data.prediction;
      const message =
        predictionValue === 1
          ? "🚨 Heart Disease Detected!"
          : "✅ No Heart Disease Detected.";

      setPrediction(message);

      // ✅ Save to Supabase
      const { error: insertError } = await supabase.from("predictions").insert([
        {
          user_id: user.id,
          age: formData.age,
          sex: formData.sex,
          chest_pain_type: formData.chest_pain_type,
          resting_blood_pressure: formData.resting_blood_pressure,
          cholesterol: formData.cholesterol,
          fasting_blood_sugar: formData.fasting_blood_sugar,
          resting_ecg: formData.resting_ecg,
          max_heart_rate: formData.max_heart_rate,
          exercise_angina: formData.exercise_angina,
          st_depression: formData.st_depression,
          st_slope: formData.st_slope,
          num_vessels: formData.num_vessels,
          thalassemia: formData.thalassemia,
          result: { prediction: predictionValue },
        },
      ]);

      if (insertError) {
        console.error("❌ Supabase insert error:", insertError.message);
      } else {
        fetchPredictionHistory();
      }
    } catch (err: any) {
      console.error("❌ Prediction error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Heart Disease Prediction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block font-medium capitalize">{key.replace(/_/g, " ")}:</label>
            <input
              type="number"
              name={key}
              value={formData[key as keyof PredictionData]}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-3">{error}</p>}
      {prediction && <p className="text-green-600 mt-3 text-lg font-medium">{prediction}</p>}

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-2">Past Predictions</h3>
      {predictionHistory.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1">
          {predictionHistory.map((entry) => (
            <li key={entry.id}>
              {new Date(entry.created_at).toLocaleString()} —{" "}
              <span className="font-medium">
                {entry.prediction.prediction === 1
                  ? "🚨 Heart Disease"
                  : "✅ No Disease"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No previous predictions found.</p>
      )}
    </div>
  );
};

export default Predict;
