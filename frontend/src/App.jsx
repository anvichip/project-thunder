// App.jsx - Enhanced with Auth Context
import { useState, useEffect, createContext, useContext } from 'react';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import ResumeUpload from './components/ResumeUpload';
import VerificationPage from './components/VerificationPage';
import RoleSelection from './components/RoleSelection';
import Congratulations from './components/Congratulations';
import MainDashboard from './components/MainDashboard';
import { profileAPI } from './services/api';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth Context
export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default function App() {
  const [currentStep, setCurrentStep] = useState('login');
  const [userData, setUserData] = useState(null);
  const [authMethod, setAuthMethod] = useState(null); // 'google' or 'email'
  const [resumeData, setResumeData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkExistingSession = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      const storedAuthMethod = localStorage.getItem('auth_method');

      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUserData(user);
          setAuthMethod(storedAuthMethod || 'email');

          const profile = await profileAPI.getProfile(user.email);
          
          if (profile && profile.profileData && profile.selectedRoles) {
            setProfileData({
              ...profile.profileData,
              selectedRoles: profile.selectedRoles
            });
            setCurrentStep('dashboard');
          } else {
            setCurrentStep('resume');
          }
        } catch (error) {
          console.error('Profile check failed:', error);
          setCurrentStep('resume');
        }
      }
      setLoading(false);
    };

    checkExistingSession();
  }, []);

  const handleLogin = async (data, method = 'email') => {
    console.log('User logged in:', data);
    setUserData(data);
    setAuthMethod(method);
    localStorage.setItem('auth_method', method);

    try {
      const profile = await profileAPI.getProfile(data.email);
      
      if (profile && profile.profileData && profile.selectedRoles) {
        setProfileData({
          ...profile.profileData,
          selectedRoles: profile.selectedRoles
        });
        setCurrentStep('dashboard');
      } else {
        setCurrentStep('resume');
      }
    } catch (error) {
      console.error('Profile check failed:', error);
      setCurrentStep('resume');
    }
  };

  const handleRegister = async (data, method = 'email') => {
    console.log('User registered:', data);
    setUserData(data);
    setAuthMethod(method);
    localStorage.setItem('auth_method', method);

    try {
      const profile = await profileAPI.getProfile(data.email);
      
      if (profile && profile.profileData && profile.selectedRoles) {
        setProfileData({
          ...profile.profileData,
          selectedRoles: profile.selectedRoles
        });
        setCurrentStep('dashboard');
      } else {
        setCurrentStep('resume');
      }
    } catch (error) {
      setCurrentStep('resume');
    }
  };

  const handleResumeNext = (data) => {
    console.log('Resume data:', data);
    setResumeData(data);
    setCurrentStep('verify');
  };

  const handleVerifyConfirm = (data) => {
    console.log('Verified data:', data);
    setProfileData(data);
    setCurrentStep('roles');
  };

  const handleRolesComplete = () => {
    console.log('Roles selected');
    setCurrentStep('congrats');
  };

  const handleGoToDashboard = () => {
    setCurrentStep('dashboard');
  };

  const handleLogout = () => {
    console.log('User logged out');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_method');
    setUserData(null);
    setAuthMethod(null);
    setResumeData(null);
    setProfileData(null);
    setCurrentStep('login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const authContextValue = {
    userData,
    authMethod,
    handleLogout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <Routes>
          <Route 
            path="/*" 
            element={
              <>
                {currentStep === 'login' && (
                  <LoginPage
                    onLogin={handleLogin}
                    onSwitchToRegister={() => setCurrentStep('register')}
                  />
                )}

                {currentStep === 'register' && (
                  <RegisterPage
                    onRegister={handleRegister}
                    onSwitchToLogin={() => setCurrentStep('login')}
                  />
                )}

                {currentStep === 'resume' && (
                  <ResumeUpload
                    userData={userData}
                    authMethod={authMethod}
                    onNext={handleResumeNext}
                    onLogout={handleLogout}
                  />
                )}

                {currentStep === 'verify' && (
                  <VerificationPage
                    extractedData={resumeData}
                    userData={userData}
                    authMethod={authMethod}
                    onConfirm={handleVerifyConfirm}
                    onBack={() => setCurrentStep('resume')}
                    onLogout={handleLogout}
                  />
                )}

                {currentStep === 'roles' && (
                  <RoleSelection
                    userData={{ ...userData, ...profileData }}
                    authMethod={authMethod}
                    onComplete={handleRolesComplete}
                    onLogout={handleLogout}
                  />
                )}

                {currentStep === 'congrats' && (
                  <Congratulations
                    onGoToDashboard={handleGoToDashboard}
                  />
                )}

                {currentStep === 'dashboard' && (
                  <MainDashboard
                    userData={userData}
                    profileData={profileData}
                    onLogout={handleLogout}
                  />
                )}
              </>
            } 
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}