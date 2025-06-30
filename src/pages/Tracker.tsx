import { useState } from 'react';
import { 
  Droplets, 
  Utensils, 
  Activity, 
  Moon, 
  Plus, 
  Minus,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { useTrackerData } from '../hooks/useTrackerData';

// Helper function to get time-based greeting
const getGreetingTime = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

export function Tracker() {
  const {
    todayLog,
    dailyTotals,
    addWater,
    addMeal,
    addExercise,
    updateSleep
  } = useTrackerData();

  const [mealName, setMealName] = useState('');
  const [exerciseType, setExerciseType] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState(15);

  // Set default goals (matching Dashboard)
  const waterGoal = 2000; // ml
  const mealsGoal = 3;
  const exerciseGoal = 60; // minutes
  const sleepGoal = 8; // hours

  // Get today's date in a readable format
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-6">
      {/* Header with Greeting */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Good {getGreetingTime()}, John!</h1>
            <p className="text-emerald-100">{today} • Track your health metrics</p>
          </div>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Water Intake */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Water Intake</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{Math.round((dailyTotals.water / waterGoal) * 100)}%</span>
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold">{dailyTotals.water}ml</div>
              <div className="text-sm text-gray-500">of {waterGoal}ml goal</div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => addWater(-250)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={dailyTotals.water <= 0}
              >
                <Minus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => addWater(250)}
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (dailyTotals.water / waterGoal) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Sleep */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Sleep</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{Math.round((dailyTotals.sleep / sleepGoal) * 100)}%</span>
              <Moon className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold">{dailyTotals.sleep.toFixed(1)}<span className="text-lg font-normal text-gray-500">h</span></div>
              <div className="text-sm text-gray-500">of {sleepGoal}h goal</div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => updateSleep(Math.max(0, dailyTotals.sleep - 0.5))}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={dailyTotals.sleep <= 0}
              >
                <Minus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => updateSleep(dailyTotals.sleep + 0.5)}
                className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (dailyTotals.sleep / sleepGoal) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Meals */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Meals</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{dailyTotals.meals}/{mealsGoal}</span>
              <Utensils className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            {todayLog.meals.slice(0, 3).map((meal, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-gray-900">{meal.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(meal.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {todayLog.meals.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                No meals logged today
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="What did you eat?"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && mealName.trim()) {
                  addMeal({ name: mealName });
                  setMealName('');
                }
              }}
            />
            <button 
              onClick={() => {
                if (mealName.trim()) {
                  addMeal({ name: mealName });
                  setMealName('');
                }
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
              disabled={!mealName.trim()}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </button>
          </div>
        </div>

        {/* Exercise */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Exercise</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{dailyTotals.exercise} min</span>
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            {todayLog.exercise.slice(0, 3).map((ex, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-gray-900">{ex.type || 'Exercise'}</div>
                    <div className="text-sm text-gray-500">
                      {ex.duration} minutes • {new Date(ex.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {todayLog.exercise.length === 0 && (
              <div className="text-center py-4 text-gray-400">
                No exercise logged today
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value)}
                placeholder="Exercise type"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="number"
                value={exerciseDuration}
                onChange={(e) => setExerciseDuration(Number(e.target.value))}
                min="1"
                max="240"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Min"
              />
            </div>
            <button 
              onClick={() => {
                if (exerciseType.trim()) {
                  addExercise({ 
                    type: exerciseType,
                    duration: exerciseDuration,
                    id: Date.now().toString(),
                    date: new Date().toISOString()
                  });
                  setExerciseType('');
                  setExerciseDuration(15);
                }
              }}
              className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
              disabled={!exerciseType.trim()}
            >
              <Plus className="w-4 h-4 mr-1" /> Log Exercise
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Summary Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Weekly Summary</h2>
          <button className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">1.8L</div>
            <div className="text-sm text-gray-500">Avg Water</div>
            <div className="flex items-center justify-center mt-1 text-xs text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" /> 5%
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-amber-600">2.7</div>
            <div className="text-sm text-gray-500">Avg Meals</div>
            <div className="flex items-center justify-center mt-1 text-xs text-red-500">
              <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" /> 2%
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">42m</div>
            <div className="text-sm text-gray-500">Avg Exercise</div>
            <div className="flex items-center justify-center mt-1 text-xs text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" /> 12%
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-indigo-600">7.2h</div>
            <div className="text-sm text-gray-500">Avg Sleep</div>
            <div className="flex items-center justify-center mt-1 text-xs text-green-500">
              <TrendingUp className="w-3 h-3 mr-1" /> 8%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}