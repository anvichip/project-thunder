// App.jsx - FIXED VERSION with Better Data Flow
import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginPage from './components/Login';
import ResumeUpload from './components/ResumeUpload';
import RoleSelection from './components/RoleSelection';
import Congratulations from './components/Congratulations';
import MainDashboard from './components/MainDashboard';
import { profileAPI, authAPI } from './services/api';

export const AuthContext = createContext(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export default function App() {
  const [currentStep, setCurrentStep] = useState('login');
  const [userData, setUserData] = useState(null);
  const [authMethod, setAuthMethod] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, user, isLoading, logout: auth0Logout } = useAuth0();

  // Check for existing session and profile completion
  useEffect(() => {
    const checkExistingSession = async () => {
      if (isLoading) return;

      try {
        // If authenticated with Auth0
        if (isAuthenticated && user) {
          console.log('Auth0 user detected:', user);
          
          const response = await authAPI.auth0Login({
            uid: user.sub,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            picture: user.picture,
            auth_provider: user.sub.startsWith('google') ? 'google' : 
                          user.sub.startsWith('linkedin') ? 'linkedin' : 'auth0'
          });

          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('auth_method', response.user.auth_provider);

          setUserData(response.user);
          setAuthMethod(response.user.auth_provider);

          // Check if profile is completed
          if (response.user.profile_completed) {
            const profile = await profileAPI.getProfile(response.user.email);
            setProfileData(profile);
            setCurrentStep('dashboard');
          } else {
            setCurrentStep('resume');
          }
        } else {
          // Check for existing token
          const token = localStorage.getItem('access_token');
          const storedUser = localStorage.getItem('user');
          const storedAuthMethod = localStorage.getItem('auth_method');

          if (token && storedUser) {
            const user = JSON.parse(storedUser);
            setUserData(user);
            setAuthMethod(storedAuthMethod || 'email');

            // Verify token is still valid and check profile
            try {
              const profile = await profileAPI.getProfile(user.email);
              setProfileData(profile);
              
              // Update profile_completed flag if needed
              if (profile.resumeData && profile.selectedRoles) {
                setCurrentStep('dashboard');
              } else {
                setCurrentStep('resume');
              }
            } catch (error) {
              console.log('No profile found, starting onboarding');
              setCurrentStep('resume');
            }
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        // Clear invalid session
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth_method');
        setCurrentStep('login');
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, [isAuthenticated, user, isLoading]);

  const handleLogin = async (data, method = 'email') => {
    console.log('User logged in:', data);
    setUserData(data);
    setAuthMethod(method);
    localStorage.setItem('auth_method', method);

    try {
      // Check if profile is completed
      if (data.profile_completed) {
        const profile = await profileAPI.getProfile(data.email);
        setProfileData(profile);
        setCurrentStep('dashboard');
      } else {
        setCurrentStep('resume');
      }
    } catch (error) {
      console.error('Profile check failed:', error);
      setCurrentStep('resume');
    }
  };

  const handleResumeNext = (data) => {
    console.log('Resume data received:', data);
    
    // Validate data structure
    if (!data || !data.sections || !Array.isArray(data.sections)) {
      console.error('Invalid resume data structure:', data);
      alert('Invalid resume data. Please try uploading again.');
      return;
    }

    // Store resume data with user email
    const resumeWithEmail = {
      ...data,
      email: userData?.email || data.email
    };
    
    setResumeData(resumeWithEmail);
    console.log('Moving to roles with data:', resumeWithEmail);
    setCurrentStep('roles');
  };

  const handleRolesComplete = () => {
    console.log('Roles selected, profile completed');
    setCurrentStep('congrats');
  };

  const handleGoToDashboard = async () => {
    try {
      // Refresh profile data before going to dashboard
      if (userData?.email) {
        const profile = await profileAPI.getProfile(userData.email);
        setProfileData(profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
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

    if (isAuthenticated) {
      auth0Logout({ returnTo: window.location.origin });
    }
  };

  if (loading || isLoading) {
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
    handleLogout,
    isAuthenticated,
    user
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

                {currentStep === 'roles' && (
                  <RoleSelection
                    userData={resumeData} // Pass resume data directly
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