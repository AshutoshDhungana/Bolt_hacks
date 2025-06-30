import { useState } from 'react';
import { User, Phone, AlertCircle, Plus, X, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { EmergencyContact } from '../types';

// Define form data type that matches the User type structure
type ProfileFormData = {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  chronicConditions: string[];
  allergies: string[];
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
};

export function Profile() {
  const { user, updateProfile } = useAuth();
  
  // Helper function to safely get user data with defaults
  const getUserData = () => ({
    name: user?.name || '',
    age: user?.age || 0,
    gender: (user?.gender as 'male' | 'female' | 'other') || 'other',
    height: user?.height || 0,
    weight: user?.weight || 0,
    chronicConditions: user?.chronicConditions || [],
    allergies: user?.allergies || [],
    emergencyContacts: (user?.emergencyContacts || []) as EmergencyContact[]
  });
  const [isEditing, setIsEditing] = useState(false);
  // Initialize form data from user context
  const [formData, setFormData] = useState<ProfileFormData>(() => {
    const userData = getUserData();
    return {
      ...userData,
      emergencyContacts: userData.emergencyContacts.map(contact => ({
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship
      }))
    };
  });

  const handleSave = () => {
    const { name, age, gender, height, weight, chronicConditions, allergies, emergencyContacts } = formData;
    
    updateProfile({
      name,
      age,
      gender: gender as 'male' | 'female' | 'other',
      height,
      weight,
      chronicConditions,
      allergies,
      emergencyContacts: emergencyContacts.map((contact, index) => ({
        id: user?.emergencyContacts?.[index]?.id || `temp-${Date.now()}-${index}`,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship
      }))
    });
    
    setIsEditing(false);
  };

  const addItem = (field: 'chronicConditions' | 'allergies' | 'emergencyContacts') => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'emergencyContacts'
        ? [...prev.emergencyContacts, { name: '', phone: '', relationship: '' }]
        : field === 'chronicConditions'
          ? [...prev.chronicConditions, '']
          : [...prev.allergies, '']
    }));
  };

  const removeItem = (field: 'chronicConditions' | 'allergies' | 'emergencyContacts', index: number) => {
    setFormData(prev => {
      if (field === 'emergencyContacts') {
        return {
          ...prev,
          emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
        };
      } else if (field === 'chronicConditions') {
        return {
          ...prev,
          chronicConditions: prev.chronicConditions.filter((_, i) => i !== index)
        };
      } else {
        return {
          ...prev,
          allergies: prev.allergies.filter((_, i) => i !== index)
        };
      }
    });
  };

  const updateItem = (field: 'chronicConditions' | 'allergies', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'chronicConditions'
        ? prev.chronicConditions.map((item, i) => i === index ? value : item)
        : prev.allergies.map((item, i) => i === index ? value : item)
    }));
  };

  const updateEmergencyContact = (index: number, field: 'name' | 'phone' | 'relationship', value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };



  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Health Profile</h1>
              <p className="text-emerald-100">Manage your personal health information securely</p>
            </div>
          </div>
          
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="mt-4 md:mt-0 flex items-center space-x-2 rounded-lg bg-white/20 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:shadow-md"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-white/5"></div>
      </div>
      
      {/* Profile Form */}
      <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">

        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50/50 disabled:text-gray-500 transition-all duration-200"
                  placeholder="John Doe"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50/50 disabled:text-gray-500 transition-all duration-200"
                  placeholder="Enter your age"
                  min="0"
                  max="120"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50/50 disabled:text-gray-500 transition-all duration-200"
                  placeholder="e.g. 175"
                  min="0"
                  max="300"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50/50 disabled:text-gray-500 transition-all duration-200"
                  placeholder="e.g. 70"
                  min="0"
                  max="500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Health Information Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Health Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800 flex items-center">
                  <span className="w-2 h-5 bg-emerald-500 rounded-full mr-2"></span>
                  Chronic Conditions
                </h3>
                {isEditing && (
                  <button
                    onClick={() => addItem('chronicConditions')}
                    className="text-emerald-600 hover:text-emerald-700 p-1 hover:bg-emerald-50 rounded-full transition-colors"
                    title="Add condition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
          
              <div className="space-y-3">
                {formData.chronicConditions.map((condition, index) => (
                  <div key={index} className="flex items-center space-x-2 group">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={condition}
                        onChange={(e) => updateItem('chronicConditions', index, e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 pl-3 pr-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50/50 disabled:text-gray-500 transition-all duration-200"
                        placeholder="e.g. Diabetes, Hypertension"
                      />
                      {isEditing && (
                        <button
                          onClick={() => removeItem('chronicConditions', index)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Remove condition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {formData.chronicConditions.length === 0 && (
                  <p className="text-gray-400 text-sm italic py-2">No chronic conditions recorded</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800 flex items-center">
                  <span className="w-2 h-5 bg-amber-500 rounded-full mr-2"></span>
                  Allergies
                </h3>
                {isEditing && (
                  <button
                    onClick={() => addItem('allergies')}
                    className="text-emerald-600 hover:text-emerald-700 p-1 hover:bg-emerald-50 rounded-full transition-colors"
                    title="Add allergy"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
          
              <div className="space-y-3">
                {formData.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center space-x-2 group">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={allergy}
                        onChange={(e) => updateItem('allergies', index, e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 pl-3 pr-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50/50 disabled:text-gray-500 transition-all duration-200"
                        placeholder="e.g. Peanuts, Penicillin"
                      />
                      {isEditing && (
                        <button
                          onClick={() => removeItem('allergies', index)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Remove allergy"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {formData.allergies.length === 0 && (
                  <p className="text-gray-400 text-sm italic py-2">No allergies recorded</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Emergency Contacts Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Emergency Contacts</h2>
            <div className="space-y-4">
              {formData.emergencyContacts.length > 0 ? (
                formData.emergencyContacts.map((contact, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          value={contact.name}
                          onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50/50 disabled:text-gray-500 transition-all duration-200"
                          placeholder="Contact name"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={contact.phone}
                            onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50/50 disabled:text-gray-500 transition-all duration-200"
                            placeholder="Phone number"
                          />
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Relationship</label>
                        <input
                          type="text"
                          value={contact.relationship}
                          onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50/50 disabled:text-gray-500 transition-all duration-200"
                          placeholder="e.g. Spouse, Parent"
                        />
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => removeItem('emergencyContacts', index)}
                          className="text-sm text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-1"
                        >
                          <X className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-gray-600 font-medium">No emergency contacts</h3>
                  <p className="text-gray-500 text-sm mt-1">Add your emergency contacts for quick access</p>
                </div>
              )}
              
              {isEditing && (
                <button
                  type="button"
                  onClick={() => addItem('emergencyContacts')}
                  className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:text-emerald-600 hover:border-emerald-400 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add Emergency Contact</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};