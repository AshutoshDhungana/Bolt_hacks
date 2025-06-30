import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Heart, 
  Smile, 
  Meh, 
  Frown, 
  Play, 
  Pause, 
  RotateCcw,
  TrendingUp,
  Calendar,
  Plus
} from 'lucide-react';
import { MoodEntry } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function MentalHealth() {
  const [moodEntries, setMoodEntries] = useLocalStorage<MoodEntry[]>('mood_entries', []);
  const [currentMood, setCurrentMood] = useState(5);
  const [moodNotes, setMoodNotes] = useState('');
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [breathingCycle, setBreathingCycle] = useState(0);

  const moodFactors = [
    'Work Stress', 'Sleep Quality', 'Exercise', 'Social Interaction', 
    'Weather', 'Diet', 'Medication', 'Family Time', 'Relaxation', 'Achievement'
  ];

  const moodEmojis = [
    { value: 1, emoji: '😢', label: 'Terrible', color: 'text-red-500' },
    { value: 2, emoji: '😟', label: 'Bad', color: 'text-red-400' },
    { value: 3, emoji: '😐', label: 'Okay', color: 'text-yellow-500' },
    { value: 4, emoji: '🙂', label: 'Good', color: 'text-yellow-400' },
    { value: 5, emoji: '😊', label: 'Great', color: 'text-green-400' },
    { value: 6, emoji: '😄', label: 'Excellent', color: 'text-green-500' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathingTimer(prev => {
          const newTimer = prev + 1;
          
          if (breathingPhase === 'inhale' && newTimer >= 4) {
            setBreathingPhase('hold');
            return 0;
          } else if (breathingPhase === 'hold' && newTimer >= 7) {
            setBreathingPhase('exhale');
            return 0;
          } else if (breathingPhase === 'exhale' && newTimer >= 8) {
            setBreathingPhase('inhale');
            setBreathingCycle(c => c + 1);
            return 0;
          }
          
          return newTimer;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isBreathingActive, breathingPhase]);

  const saveMoodEntry = () => {
    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: currentMood,
      notes: moodNotes,
      factors: selectedFactors
    };

    setMoodEntries(prev => [...prev, entry]);
    setMoodNotes('');
    setSelectedFactors([]);
  };

  const toggleFactor = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  const startBreathing = () => {
    setIsBreathingActive(true);
    setBreathingPhase('inhale');
    setBreathingTimer(0);
    setBreathingCycle(0);
  };

  const stopBreathing = () => {
    setIsBreathingActive(false);
    setBreathingTimer(0);
    setBreathingCycle(0);
  };

  const getWeeklyMoodAverage = () => {
    const lastWeek = moodEntries.slice(-7);
    if (lastWeek.length === 0) return 0;
    const total = lastWeek.reduce((sum, entry) => sum + entry.mood, 0);
    return Math.round(total / lastWeek.length * 10) / 10;
  };

  const getCurrentMoodEmoji = () => {
    const moodData = moodEmojis.find(m => m.value === currentMood);
    return moodData || moodEmojis[2];
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
    }
  };

  const getBreathingColor = () => {
    switch (breathingPhase) {
      case 'inhale': return 'bg-blue-500';
      case 'hold': return 'bg-yellow-500';
      case 'exhale': return 'bg-green-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Mental Health Hub</h1>
            <p className="text-pink-100">Track your mood and practice mindfulness</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{moodEntries.length}</div>
            <div className="text-sm text-pink-100">Mood Entries</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{getWeeklyMoodAverage()}</div>
            <div className="text-sm text-pink-100">Week Average</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{breathingCycle}</div>
            <div className="text-sm text-pink-100">Breathing Cycles</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">
              {moodEntries.filter(entry => 
                new Date(entry.date).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <div className="text-sm text-pink-100">Today's Entries</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Tracker */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <Heart className="w-5 h-5 text-pink-600" />
            <h2 className="text-lg font-semibold text-gray-900">Mood Tracker</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                How are you feeling right now?
              </label>
              
              <div className="flex justify-between items-center mb-4">
                {moodEmojis.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setCurrentMood(mood.value)}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                      currentMood === mood.value 
                        ? 'bg-pink-100 border-2 border-pink-500 scale-110' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl mb-1">{mood.emoji}</span>
                    <span className={`text-xs font-medium ${mood.color}`}>
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="text-center">
                <span className="text-4xl">{getCurrentMoodEmoji().emoji}</span>
                <p className={`text-lg font-semibold ${getCurrentMoodEmoji().color}`}>
                  {getCurrentMoodEmoji().label}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's influencing your mood? (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {moodFactors.map((factor) => (
                  <button
                    key={factor}
                    onClick={() => toggleFactor(factor)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedFactors.includes(factor)
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {factor}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional notes (optional)
              </label>
              <textarea
                value={moodNotes}
                onChange={(e) => setMoodNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                rows={3}
                placeholder="How are you feeling? What happened today?"
              />
            </div>

            <button
              onClick={saveMoodEntry}
              className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Save Mood Entry</span>
            </button>
          </div>
        </div>

        {/* Breathing Exercise */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <Heart className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Breathing Exercise</h2>
          </div>

          <div className="text-center space-y-6">
            <div className="text-sm text-gray-600 mb-4">
              4-7-8 Breathing Technique: Inhale for 4, Hold for 7, Exhale for 8
            </div>

            <div className="relative">
              <div className={`w-32 h-32 mx-auto rounded-full transition-all duration-1000 ${getBreathingColor()} ${
                isBreathingActive ? 'opacity-100' : 'opacity-30'
              }`}></div>
              
              {isBreathingActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-lg font-semibold">{getBreathingInstruction()}</div>
                    <div className="text-sm">{breathingTimer}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {isBreathingActive ? (
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {getBreathingInstruction()}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Cycle {breathingCycle + 1} • {breathingTimer}s
                  </p>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={stopBreathing}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Stop</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Take a moment to focus on your breathing and relax your mind
                  </p>
                  <button
                    onClick={startBreathing}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Breathing Exercise</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mood History */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Mood History</h2>
        </div>

        {moodEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No mood entries yet</p>
            <p className="text-sm">Start tracking your mood to see patterns over time</p>
          </div>
        ) : (
          <div className="space-y-4">
            {moodEntries.slice(-7).reverse().map((entry) => {
              const moodData = moodEmojis.find(m => m.value === entry.mood) || moodEmojis[2];
              return (
                <div key={entry.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{moodData.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`font-medium ${moodData.color}`}>
                        {moodData.label}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {entry.factors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {entry.factors.map((factor) => (
                          <span key={factor} className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                            {factor}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {entry.notes && (
                      <p className="text-sm text-gray-700">{entry.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}