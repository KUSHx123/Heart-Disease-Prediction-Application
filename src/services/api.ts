export interface PredictionResponse {
    prediction: number;
  }
  
  export const getPrediction = async (features: number[]): Promise<PredictionResponse> => {
    try {
      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ features }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }
  
      return response.json();
    } catch (error) {
      console.error("Error fetching prediction:", error);
      throw error;
    }
  };
  