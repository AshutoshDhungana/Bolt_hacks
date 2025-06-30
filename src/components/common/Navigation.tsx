import React from 'react';
import { 
  User, 
  Stethoscope, 
  Activity, 
  Pill, 
  Calendar, 
  MessageSquare, 
  Brain,
  LayoutDashboard
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isDesktop: boolean;
}

const navigationItems = [
  
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, showInMobile: false },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'symptom-checker', label: 'Symptoms', icon: Stethoscope },
  { id: 'tracker', label: 'Tracker', icon: Activity },
  { id: 'medications', label: 'Medications', icon: Pill },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'ai-assistant', label: 'AI Assistant', icon: MessageSquare },
  { id: 'mental-health', label: 'Mental Health', icon: Brain },
];

export function Navigation({ currentPage, onPageChange, isDesktop }: NavigationProps) {
  if (isDesktop) {
    return (
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex justify-around items-center py-2 overflow-x-auto">
      {navigationItems.map((item) => {
        // Skip rendering dashboard in mobile view
        if (item.id === 'dashboard') return null;
        
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
              isActive
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            title={item.label}
          >
            <Icon className="w-6 h-6" />
          </button>
        );
      })}
    </nav>
  );
}