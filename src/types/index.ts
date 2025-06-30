export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  chronicConditions: string[];
  allergies: string[];
  medications: string[];
  emergencyContacts: EmergencyContact[];
  isAuthenticated: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface SymptomCheckResult {
  id: string;
  symptoms: string[];
  possibleConditions: string[];
  triageLevel: 'self-care' | 'consult-doctor' | 'emergency';
  recommendations: string[];
  timestamp: Date;
}

export interface HealthLog {
  id: string;
  date: string;
  waterIntake: number; // in ml
  meals: Meal[];
  exercise: Exercise[];
  sleepHours: number;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  calories?: number;
}

export interface Exercise {
  id: string;
  type: string;
  duration: number; // in minutes
  intensity: 'low' | 'moderate' | 'high';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  taken: { [date: string]: boolean[] };
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  type: string;
  notes?: string;
}

export interface HealthNote {
  id: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-10 scale
  notes?: string;
  factors: string[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}