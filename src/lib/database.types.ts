export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      predictions: {
        Row: {
          id: string;
          user_id: string;
          age: number;
          gender: string;
          cholesterol: number;
          blood_pressure: number;
          heart_rate: number;
          glucose: number;
          chest_pain_type: string;
          fasting_blood_sugar: boolean;
          resting_ecg: string;
          exercise_angina: boolean;
          st_depression: number;
          st_slope: string;
          num_vessels: number;
          thalassemia: string;
          risk_level: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          age: number;
          gender: string;
          cholesterol: number;
          blood_pressure: number;
          heart_rate: number;
          glucose: number;
          chest_pain_type: string;
          fasting_blood_sugar: boolean;
          resting_ecg: string;
          exercise_angina: boolean;
          st_depression: number;
          st_slope: string;
          num_vessels: number;
          thalassemia: string;
          risk_level: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          age?: number;
          gender?: string;
          cholesterol?: number;
          blood_pressure?: number;
          heart_rate?: number;
          glucose?: number;
          chest_pain_type?: string;
          fasting_blood_sugar?: boolean;
          resting_ecg?: string;
          exercise_angina?: boolean;
          st_depression?: number;
          st_slope?: string;
          num_vessels?: number;
          thalassemia?: string;
          risk_level?: number;
          created_at?: string;
        };
      };
    };
  };
}