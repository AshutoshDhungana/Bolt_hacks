import { useState, useEffect } from 'react';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate: string;
  taken: { [date: string]: boolean[] };
}

export interface Appointment {
  id: string;
  doctor: string;
  type: string;
  date: string;
  time: string;
}

export interface HealthData {
  water: number;
  waterGoal: number;
  meals: number;
  mealsGoal: number;
  exercise: number;
  exerciseGoal: number;
  sleep: number;
  sleepGoal: number;
  medications: Medication[];
  appointments: Appointment[];
}

const DEFAULT_HEALTH_DATA: HealthData = {
  water: 0,
  waterGoal: 2000,
  meals: 0,
  mealsGoal: 3,
  exercise: 0,
  exerciseGoal: 60,
  sleep: 0,
  sleepGoal: 8,
  medications: [],
  appointments: []
};

export function useHealthData() {
  const [healthData, setHealthData] = useState<HealthData>(() => {
    const saved = localStorage.getItem('healthData');
    return saved ? JSON.parse(saved) : DEFAULT_HEALTH_DATA;
  });

  // Save to localStorage whenever healthData changes
  useEffect(() => {
    localStorage.setItem('healthData', JSON.stringify(healthData));
  }, [healthData]);

  const updateHealthData = (updates: Partial<HealthData>) => {
    setHealthData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const addMedication = (medication: Omit<Medication, 'id' | 'taken'>) => {
    setHealthData(prev => ({
      ...prev,
      medications: [
        ...prev.medications, 
        { 
          ...medication, 
          id: Date.now().toString(),
          taken: {}
        }
      ]
    }));
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    setHealthData(prev => ({
      ...prev,
      appointments: [
        ...prev.appointments, 
        { 
          ...appointment, 
          id: Date.now().toString() 
        }
      ]
    }));
  };

  const markMedicationTaken = (index: number) => {
    setHealthData(prev => {
      const updatedMeds = [...prev.medications];
      updatedMeds[index] = { ...updatedMeds[index], taken: true };
      return {
        ...prev,
        medications: updatedMeds
      };
    });
  };

  return {
    healthData,
    updateHealthData,
    addMedication,
    addAppointment,
    markMedicationTaken
  };
}
