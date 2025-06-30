import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { Layout } from './components/common/Layout';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { SymptomChecker } from './pages/SymptomChecker';
import { Tracker } from './pages/Tracker';
import { Medications } from './pages/Medications';
import { Appointments } from './pages/Appointments';
import { AIAssistant } from './pages/AIAssistant';
import { MentalHealth } from './pages/MentalHealth';
import { Heart, Stethoscope } from 'lucide-react';

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HealthAssistant</h1>
          <p className="text-gray-600">Your personal health companion</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {isLogin ? (
            <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <SignUpForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Demo app - Use any email/password to continue</p>
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user?.isAuthenticated) {
    return <AuthScreen />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <Profile />;
      case 'symptom-checker':
        return <SymptomChecker />;
      case 'tracker':
        return <Tracker />;
      case 'medications':
        return <Medications />;
      case 'appointments':
        return <Appointments />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'mental-health':
        return <MentalHealth />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;