export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'doctor' | 'patient';
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  mobileNumber?: string;
  city?: string;
  country?: string;
  preferences: {
    darkMode: boolean;
    theme: 'default' | 'healthcare' | 'minimalist';
    notifications: boolean;
  };
}

export interface LoginActivity {
  id: string;
  userId: string;
  deviceType: string;
  browser: string;
  location: string;
  ipAddress: string;
  timestamp: string;
  isCurrentSession: boolean;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface NotificationPreferences {
  marketing: boolean;
  securityAlerts: boolean;
  updates: boolean;
  appointments: boolean;
  predictions: boolean;
}

export interface VisibilitySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  activityHistory: boolean;
  lastSeen: boolean;
}

export interface PredictionData {
  age: number;
  gender: 'male' | 'female';
  cholesterol: number;
  bloodPressure: number;
  heartRate: number;
  glucose: number;
  chestPainType: 'typical' | 'atypical' | 'nonAnginal' | 'asymptomatic';
  fastingBloodSugar: boolean;
  restingECG: 'normal' | 'sttWaveAbnormality' | 'leftVentricularHypertrophy';
  exerciseAngina: boolean;
  stDepression: number;
  stSlope: 'upsloping' | 'flat' | 'downsloping';
  numVessels: 0 | 1 | 2 | 3;
  thalassemia: 'normal' | 'fixedDefect' | 'reversibleDefect';
  target?: boolean;
}

export interface PredictionResult {
  probability: number;
  metrics: {
    precision: number;
    recall: number;
    f1Score: number;
  };
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  type: 'consultation' | 'followup';
}

export interface HealthInsight {
  id: string;
  userId: string;
  type: 'warning' | 'tip' | 'achievement';
  message: string;
  date: string;
  dismissed: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'prediction' | 'appointment' | 'insight' | 'system';
  read: boolean;
  date: string;
}

export interface ProfileData {
  fullName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  mobileNumber: string;
  city: string;
  country: string;
  avatarUrl: string | null;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}