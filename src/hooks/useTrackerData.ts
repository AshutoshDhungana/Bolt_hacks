import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { HealthLog, Meal, Exercise } from '../types';

export function useTrackerData() {
  const today = new Date().toISOString().split('T')[0];
  const [healthLogs, setHealthLogs] = useLocalStorage<HealthLog[]>('health_logs', []);
  
  // Get or create today's log
  const [todayLog, setTodayLog] = useState<HealthLog>(() => {
    const existing = healthLogs.find(log => log.date === today);
    return existing || {
      id: Date.now().toString(),
      date: today,
      waterIntake: 0,
      meals: [],
      exercise: [],
      sleepHours: 0
    };
  });

  // Update the log and sync with localStorage
  const updateLog = (updates: Partial<HealthLog>) => {
    const newLog = { ...todayLog, ...updates };
    setTodayLog(newLog);
    
    const updatedLogs = healthLogs.filter(log => log.date !== today);
    setHealthLogs([...updatedLogs, newLog]);
  };

  // Helper methods for specific updates
  const addWater = (amount: number) => {
    updateLog({ waterIntake: Math.max(0, todayLog.waterIntake + amount) });
  };

  const addMeal = (meal?: Partial<Meal>) => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: meal?.name || 'Meal',
      time: meal?.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      calories: meal?.calories
    };
    updateLog({ meals: [...todayLog.meals, newMeal] });
  };

  const addExercise = (exercise: Partial<Exercise>) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      type: exercise.type || 'Exercise',
      duration: exercise.duration || 0,
      caloriesBurned: exercise.caloriesBurned
    };
    updateLog({ exercise: [...todayLog.exercise, newExercise] });
  };

  const updateSleep = (hours: number) => {
    updateLog({ sleepHours: Math.max(0, hours) });
  };

  // Calculate daily totals
  const dailyTotals = {
    water: todayLog.waterIntake,
    meals: todayLog.meals.length,
    exercise: todayLog.exercise.reduce((total, ex) => total + (ex.duration || 0), 0),
    sleep: todayLog.sleepHours
  };

  return {
    todayLog,
    dailyTotals,
    addWater,
    addMeal,
    addExercise,
    updateSleep,
    updateLog
  };
}
