import React, { useState } from 'react';
import { 
  Activity, 
  Droplets, 
  Moon, 
  Utensils, 
  Pill, 
  Calendar, 
  TrendingUp,
  Heart,
  Plus,
  ChevronRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { CircularProgress } from '../components/common/CircularProgress';
import { type Medication, type Appointment } from '../types';
import { useTrackerData } from '../hooks/useTrackerData';
import { useHealthData } from '../hooks/useHealthData';

// Helper function to get time-based greeting
const getGreetingTime = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

export function Dashboard() {
  const {
    dailyTotals,
    addWater,
    addMeal,
    addExercise,
    updateSleep
  } = useTrackerData();

  // Get health data including medications and appointments
  const { healthData, updateHealthData } = useHealthData();
  
  // Safely extract medications and appointments with defaults
  const medications = healthData?.medications || [];
  const appointments = healthData?.appointments || [];
  
  // Get today's date in YYYY-MM-DD format for tracking medication intake
  const today = new Date().toISOString().split('T')[0];
  const currentDay = new Date().getDay().toString();
  
  // Filter out past appointments and sort by date and time
  const upcomingAppointments = (appointments || [])
    .filter((apt: Appointment) => {
      try {
        return new Date(`${apt.date}T${apt.time}`) >= new Date();
      } catch (e) {
        console.warn('Invalid appointment date format', apt);
        return false;
      }
    })
    .sort((a: Appointment, b: Appointment) => {
      try {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      } catch (e) {
        return 0;
      }
    });

  // Get today's medication doses
  const getTodaysDoses = () => {
    const doses: Array<{
      medication: Medication;
      time: string;
      timeIndex: number;
      taken: boolean;
    }> = [];

    medications.forEach(med => {
      med.times?.forEach((time, timeIndex) => {
        doses.push({
          medication: med,
          time,
          timeIndex,
          taken: med.taken?.[today]?.[timeIndex] || false
        });
      });
    });

    return doses.sort((a, b) => a.time.localeCompare(b.time));
  };

  const todaysDoses = getTodaysDoses();
  const nextDoses = todaysDoses.filter(dose => !dose.taken).slice(0, 2);

  const markAsTaken = (medId: string, timeIndex: number) => {
    updateHealthData({
      medications: medications.map(med => {
        if (med.id === medId) {
          const taken = { ...med.taken };
          if (!taken[today]) taken[today] = [];
          taken[today][timeIndex] = true;
          return { ...med, taken };
        }
        return med;
      })
    });
  };

  // Set default goals (can be made configurable later)
  const waterGoal = 2000; // ml
  const mealsGoal = 3;
  const exerciseGoal = 60; // minutes
  const sleepGoal = 8; // hours

  // Get today's date in a readable format
  const todayReadable = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Good {getGreetingTime()}, John!</h1>
            <p className="text-emerald-100">{todayReadable} • Let's check on your health today</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Droplets className="w-5 h-5" />
              <span className="text-sm font-medium">Water</span>
              <button 
                onClick={() => addWater(200)}
                className="ml-auto bg-white/20 rounded-full p-1 hover:bg-white/30 transition-colors"
                title="Add 200ml"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="text-2xl font-bold">{dailyTotals.water}ml</div>
            <div className="w-full bg-white/30 rounded-full h-2 mt-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, (dailyTotals.water / waterGoal) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Utensils className="w-5 h-5" />
              <span className="text-sm font-medium">Meals</span>
            </div>
            <div className="text-2xl font-bold">{dailyTotals.meals}</div>
            <div className="text-sm text-emerald-100">of {mealsGoal} meals</div>
            <button 
              onClick={() => addMeal()}
              className="mt-2 text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
              disabled={dailyTotals.meals >= mealsGoal}
            >
              Add Meal
            </button>
          </div>
          
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5" />
              <span className="text-sm font-medium">Exercise</span>
            </div>
            <div className="text-2xl font-bold">{dailyTotals.exercise} min</div>
            <div className="text-sm text-emerald-100">of {exerciseGoal} min</div>
            <button 
              onClick={() => addExercise({ duration: 10 })}
              className="mt-2 text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
              disabled={dailyTotals.exercise >= exerciseGoal}
            >
              +10 min
            </button>
          </div>
          
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Moon className="w-5 h-5" />
              <span className="text-sm font-medium">Sleep</span>
            </div>
            <div className="text-2xl font-bold">{dailyTotals.sleep.toFixed(1)} hrs</div>
            <div className="text-sm text-emerald-100">Goal: {sleepGoal} hrs</div>
            <div className="mt-2 flex space-x-1">
              <button 
                onClick={() => updateSleep(dailyTotals.sleep + 0.5)}
                className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
                disabled={dailyTotals.sleep >= sleepGoal}
              >
                +30m
              </button>
              <button 
                onClick={() => updateSleep(dailyTotals.sleep + 1)}
                className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
                disabled={dailyTotals.sleep >= sleepGoal}
              >
                +1h
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Medications</h2>
            <Pill className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {nextDoses.length > 0 ? (
              nextDoses.map((dose, index) => (
                <div key={`${dose.medication.id}-${dose.timeIndex}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{dose.medication.name}</div>
                    <div className="text-sm text-gray-600">{dose.medication.dosage} • {dose.time}</div>
                  </div>
                  <button
                    onClick={() => markAsTaken(dose.medication.id, dose.timeIndex)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      dose.taken
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {dose.taken ? 'Taken' : 'Mark as taken'}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">No medications due today</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.slice(0, 2).map((appointment) => (
                <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">{appointment.doctor}</div>
                  <div className="text-sm text-gray-600">{appointment.type}</div>
                  <div className="text-sm text-emerald-600 font-medium">
                    {new Date(appointment.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric' 
                    })} at {appointment.time}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">No upcoming appointments</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Weekly Progress</h2>
            <p className="text-sm text-gray-500">Your health metrics this week</p>
          </div>
          <button className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700">
            View Details <ChevronRight className="ml-1 w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Water Goal */}
          <div className="group relative">
            <div className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <CircularProgress 
                value={85} 
                size={90}
                progressColor="#10b981"
                trackColor="#d1fae5"
              >
                <div className="text-center">
                  <span className="block text-2xl font-bold text-emerald-600">85%</span>
                  <span className="text-xs text-gray-500">of goal</span>
                </div>
              </CircularProgress>
              <h3 className="mt-4 font-medium text-gray-900">Water Intake</h3>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                <span>5% from last week</span>
              </div>
            </div>
          </div>
          
          {/* Medication */}
          <div className="group relative">
            <div className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <CircularProgress 
                value={92} 
                size={90}
                progressColor="#3b82f6"
                trackColor="#dbeafe"
              >
                <div className="text-center">
                  <span className="block text-2xl font-bold text-blue-600">92%</span>
                  <span className="text-xs text-gray-500">adherence</span>
                </div>
              </CircularProgress>
              <h3 className="mt-4 font-medium text-gray-900">Medication</h3>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                <span>3% from last week</span>
              </div>
            </div>
          </div>
          
          {/* Exercise */}
          <div className="group relative">
            <div className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <CircularProgress 
                value={78} 
                size={90}
                progressColor="#8b5cf6"
                trackColor="#ede9fe"
              >
                <div className="text-center">
                  <span className="block text-2xl font-bold text-purple-600">78%</span>
                  <span className="text-xs text-gray-500">of goal</span>
                </div>
              </CircularProgress>
              <h3 className="mt-4 font-medium text-gray-900">Exercise</h3>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                <span>2% from last week</span>
              </div>
            </div>
          </div>
          
          {/* Sleep */}
          <div className="group relative">
            <div className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <CircularProgress 
                value={88} 
                size={90}
                progressColor="#6366f1"
                trackColor="#e0e7ff"
              >
                <div className="text-center">
                  <span className="block text-2xl font-bold text-indigo-600">88%</span>
                  <span className="text-xs text-gray-500">of goal</span>
                </div>
              </CircularProgress>
              <h3 className="mt-4 font-medium text-gray-900">Sleep</h3>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                <span>7% from last week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}