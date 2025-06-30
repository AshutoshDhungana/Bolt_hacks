import React, { useState } from 'react';
import { Search, AlertTriangle, Info, Phone, Plus, X } from 'lucide-react';
import { SymptomCheckResult } from '../types';

export function SymptomChecker() {
  const [symptoms, setSymptoms] = useState<string[]>(['']);
  const [results, setResults] = useState<SymptomCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addSymptom = () => {
    setSymptoms([...symptoms, '']);
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const updateSymptom = (index: number, value: string) => {
    const newSymptoms = [...symptoms];
    newSymptoms[index] = value;
    setSymptoms(newSymptoms);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const filteredSymptoms = symptoms.filter(s => s.trim());
    const mockResult: SymptomCheckResult = {
      id: Date.now().toString(),
      symptoms: filteredSymptoms,
      possibleConditions: ['Common Cold', 'Flu', 'Allergic Rhinitis'],
      triageLevel: 'self-care',
      recommendations: [
        'Get plenty of rest',
        'Stay hydrated',
        'Consider over-the-counter medications for symptom relief',
        'Monitor symptoms for worsening'
      ],
      timestamp: new Date()
    };
    
    setResults(mockResult);
    setIsLoading(false);
  };

  const getTriageColor = (level: string) => {
    switch (level) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'consult-doctor': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'self-care': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTriageIcon = (level: string) => {
    switch (level) {
      case 'emergency': return <Phone className="w-5 h-5" />;
      case 'consult-doctor': return <AlertTriangle className="w-5 h-5" />;
      case 'self-care': return <Info className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Symptom Checker</h1>
          <p className="text-gray-600">
            Describe your symptoms and get preliminary health guidance. 
            <span className="font-medium text-amber-600"> This is not a substitute for professional medical advice.</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What symptoms are you experiencing?
            </label>
            
            <div className="space-y-3">
              {symptoms.map((symptom, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={symptom}
                    onChange={(e) => updateSymptom(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., headache, fever, sore throat"
                  />
                  {symptoms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSymptom(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addSymptom}
                className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add another symptom</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !symptoms.some(s => s.trim())}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing symptoms...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Check Symptoms</span>
              </>
            )}
          </button>
        </form>
      </div>

      {results && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Assessment Results</h2>
          
          <div className="space-y-6">
            <div className={`p-4 rounded-lg border ${getTriageColor(results.triageLevel)}`}>
              <div className="flex items-center space-x-2 mb-2">
                {getTriageIcon(results.triageLevel)}
                <span className="font-semibold">
                  {results.triageLevel === 'emergency' && 'Seek Emergency Care'}
                  {results.triageLevel === 'consult-doctor' && 'Consult a Doctor'}
                  {results.triageLevel === 'self-care' && 'Self-Care Recommended'}
                </span>
              </div>
              <p className="text-sm">
                {results.triageLevel === 'emergency' && 
                  'Your symptoms may require immediate medical attention. Consider calling emergency services or visiting an emergency room.'}
                {results.triageLevel === 'consult-doctor' && 
                  'Your symptoms suggest you should consult with a healthcare professional within the next day or two.'}
                {results.triageLevel === 'self-care' && 
                  'Your symptoms can likely be managed with self-care measures. Monitor for any worsening.'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Possible Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {results.possibleConditions.map((condition, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{condition}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}