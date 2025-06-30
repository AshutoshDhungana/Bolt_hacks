import React, { useState } from 'react';
import { 
  Pill, 
  Plus, 
  Clock, 
  Calendar, 
  Check, 
  X, 
  Bell, 
  Edit3,
  Trash2
} from 'lucide-react';
import { Medication } from '../hooks/useHealthData';
import { useHealthData } from '../hooks/useHealthData';

export function Medications() {
  const { healthData, updateHealthData } = useHealthData();
  const medications = healthData.medications;
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  
  const [formData, setFormData] = useState<Omit<Medication, 'id' | 'taken'>>({
    name: '',
    dosage: '',
    frequency: 'daily',
    times: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMedication: Medication = {
      id: editingMed?.id || Date.now().toString(),
      ...formData,
      taken: editingMed?.taken || {}
    };

    if (editingMed) {
      updateHealthData({
        medications: medications.map(med => med.id === editingMed.id ? newMedication : med)
      });
      setEditingMed(null);
    } else {
      updateHealthData({
        medications: [...medications, newMedication]
      });
    }

    setFormData({
      name: '',
      dosage: '',
      frequency: 'daily',
      times: ['08:00'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    });
    setShowAddForm(false);
  };

  const markAsTaken = (medId: string, timeIndex: number) => {
    const today = new Date().toISOString().split('T')[0];
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

  const deleteMedication = (medId: string) => {
    updateHealthData({
      medications: medications.filter(med => med.id !== medId)
    });
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      times: [...prev.times, '12:00']
    }));
  };

  const updateTimeSlot = (index: number, time: string) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.map((t, i) => i === index ? time : t)
    }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }));
  };

  const getTodaysDoses = () => {
    const today = new Date().toISOString().split('T')[0];
    const doses: Array<{
      medication: Medication;
      time: string;
      timeIndex: number;
      taken: boolean;
    }> = [];

    medications.forEach(med => {
      med.times.forEach((time, timeIndex) => {
        doses.push({
          medication: med,
          time,
          timeIndex,
          taken: med.taken[today]?.[timeIndex] || false
        });
      });
    });

    return doses.sort((a, b) => a.time.localeCompare(b.time));
  };

  const startEdit = (med: Medication) => {
    setFormData({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      times: med.times,
      startDate: med.startDate,
      endDate: med.endDate || ''
    });
    setEditingMed(med);
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingMed(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      dosage: '',
      frequency: 'daily',
      times: ['08:00'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    });
  };

  const todaysDoses = getTodaysDoses();
  const completedToday = todaysDoses.filter(dose => dose.taken).length;
  const totalToday = todaysDoses.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Pill className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Medication Manager</h1>
              <p className="text-blue-100">Stay on track with your medications</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medication</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{completedToday}</div>
            <div className="text-sm text-blue-100">Taken Today</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{totalToday}</div>
            <div className="text-sm text-blue-100">Total Today</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{medications.length}</div>
            <div className="text-sm text-blue-100">Active Meds</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0}%</div>
            <div className="text-sm text-blue-100">Compliance</div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-6">
          <Clock className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
        </div>

        {todaysDoses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No medications scheduled for today</p>
            <p className="text-sm">Add your first medication to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaysDoses.map((dose, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${
                dose.taken ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    dose.taken ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <div className="font-medium text-gray-900">{dose.medication.name}</div>
                    <div className="text-sm text-gray-600">{dose.medication.dosage}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600">{dose.time}</span>
                  {dose.taken ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Taken</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => markAsTaken(dose.medication.id, dose.timeIndex)}
                      className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm hover:bg-emerald-600 transition-colors"
                    >
                      Mark Taken
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Medications */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">All Medications</h2>
        
        {medications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No medications added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.map(med => (
              <div key={med.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{med.name}</h3>
                    <p className="text-sm text-gray-600">{med.dosage}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEdit(med)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMedication(med.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Bell className="w-4 h-4" />
                    <span>{med.frequency} at {med.times.join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Started {new Date(med.startDate).toLocaleDateString()}
                      {med.endDate && ` - Ends ${new Date(med.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Medication Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingMed ? 'Edit Medication' : 'Add New Medication'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medication Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage
                </label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 10mg, 1 tablet"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="twice-daily">Twice Daily</option>
                  <option value="three-times-daily">Three Times Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="as-needed">As Needed</option>
                </select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Times
                  </label>
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Add Time
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.times.map((time, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => updateTimeSlot(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {formData.times.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingMed ? 'Update Medication' : 'Add Medication'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}