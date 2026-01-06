// App.jsx
import { useState, useEffect } from 'react';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import ResumeUpload from './components/ResumeUpload';
import VerificationPage from './components/VerificationPage';
import RoleSelection from './components/RoleSelection';
import Congratulations from './components/Congratulations';
import MainDashboard from './components/MainDashboard';
import { profileAPI } from './services/api';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
  const [currentStep, setCurrentStep] = useState('login');
  const [userData, setUserData] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    const checkExistingSession = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUserData(user);

          // Check if user has completed profile setup
          const profile = await profileAPI.getProfile(user.email);
          
          if (profile && profile.profileData && profile.selectedRoles) {
            // User has completed setup, go to dashboard
            setProfileData({
              ...profile.profileData,
              selectedRoles: profile.selectedRoles
            });
            setCurrentStep('dashboard');
          } else {
            // User exists but hasn't completed setup
            setCurrentStep('resume');
          }
        } catch (error) {
          console.error('Profile check failed:', error);
          // Profile doesn't exist or error occurred, start from resume upload
          setCurrentStep('resume');
        }
      }
      setLoading(false);
    };

    checkExistingSession();
  }, []);

  const handleLogin = async (data) => {
    console.log('User logged in:', data);
    setUserData(data);

    try {
      // Check if user has completed profile setup
      const profile = await profileAPI.getProfile(data.email);
      
      if (profile && profile.profileData && profile.selectedRoles) {
        // User has completed setup, go to dashboard
        setProfileData({
          ...profile.profileData,
          selectedRoles: profile.selectedRoles
        });
        setCurrentStep('dashboard');
      } else {
        // New user or incomplete profile, continue setup
        setCurrentStep('resume');
      }
    } catch (error) {
      console.error('Profile check failed:', error);
      // Profile doesn't exist, start onboarding
      setCurrentStep('resume');
    }
  };

  const handleRegister = async (data) => {
    console.log('User registered:', data);
    setUserData(data);

    try {
      // Check if profile exists (in case of Google sign-up returning user)
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
      // New user, continue with setup
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
    setUserData(null);
    setResumeData(null);
    setProfileData(null);
    setCurrentStep('login');
  };

  // Show loading screen while checking session
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

  return (
    <Router>
      <Routes>
        <Route 
          path="/*" 
          element={
            <>
              {currentStep === 'register' && (
                <RegisterPage
                  onRegister={handleRegister}
                  onSwitchToLogin={() => setCurrentStep('login')}
                />
              )}

              {currentStep === 'resume' && (
                <ResumeUpload
                  userData={userData}
                  onNext={handleResumeNext}
                />
              )}

              {currentStep === 'verify' && (
                <VerificationPage
                  extractedData={resumeData}
                  onConfirm={handleVerifyConfirm}
                  onBack={() => setCurrentStep('resume')}
                />
              )}

              {currentStep === 'roles' && (
                <RoleSelection
                  userData={{ ...userData, ...profileData }}
                  onComplete={handleRolesComplete}
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

              {currentStep === 'login' && (
                <LoginPage
                  onLogin={handleLogin}
                  onSwitchToRegister={() => setCurrentStep('register')}
                />
              )}
            </>
          } 
        />
      </Routes>
    </Router>
  );
}