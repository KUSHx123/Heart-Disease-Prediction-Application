export interface PredictionResponse {
  prediction: number;
}

export const getPrediction = async (features: number[]): Promise<PredictionResponse> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/predict/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ features }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch prediction: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching prediction:", error);
    throw error;
  }
};

// Fetch prediction history from Supabase
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client using Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getPredictionHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("predictions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching prediction history:", error);
    return [];
  }
};
