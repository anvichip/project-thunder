// src/App.jsx - Fixed authentication flow
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginPage from './components/Login';
import ResumeUpload from './components/ResumeUpload';
import RoleSelection from './components/RoleSelection';
import Congratulations from './components/Congratulations';
import MainDashboard from './components/MainDashboard';
import { profileAPI } from './services/api';
import './index.css';

function App() {
  const { isAuthenticated, isLoading, user, logout } = useAuth0();
  
  // Get initial state from URL or localStorage
  const getInitialView = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewFromUrl = urlParams.get('view');
    if (viewFromUrl) return viewFromUrl;
    return localStorage.getItem('currentView') || 'login';
  };

  const getInitialTab = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) return tabFromUrl;
    return localStorage.getItem('activeTab') || 'profile';
  };

  const [currentView, setCurrentView] = useState(getInitialView);
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [userData, setUserData] = useState(null);
  const [authMethod, setAuthMethod] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAuthMethod = localStorage.getItem('auth_method');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setAuthMethod(storedAuthMethod);
        
        // If user is stored and we're on login, check their profile
        if (currentView === 'login') {
          checkUserProfile(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Handle Auth0 authentication
  useEffect(() => {
    if (isAuthenticated && user && !userData) {
      const auth0UserData = {
        email: user.email,
        name: user.name,
        picture: user.picture,
        sub: user.sub
      };
      
      setUserData(auth0UserData);
      setAuthMethod('auth0');
      localStorage.setItem('user', JSON.stringify(auth0UserData));
      localStorage.setItem('auth_method', 'auth0');
      
      // Check if user has a profile
      checkUserProfile(auth0UserData);
    }
  }, [isAuthenticated, user, userData]);

  // Check if user has existing profile
  const checkUserProfile = async (user) => {
    if (!user || !user.email) return;
    
    setCheckingProfile(true);
    try {
      const profile = await profileAPI.getProfile(user.email);
      
      if (profile && profile.resumeData && profile.resumeData.sections) {
        // User has a complete profile, go to dashboard
        setResumeData(profile);
        updateView('dashboard', 'profile');
      } else {
        // User needs to complete onboarding
        updateView('upload');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      // If profile doesn't exist (404), go to upload
      if (error.response && error.response.status === 404) {
        updateView('upload');
      } else {
        // For other errors, stay on current view or go to upload
        if (currentView === 'login') {
          updateView('upload');
        }
      }
    } finally {
      setCheckingProfile(false);
    }
  };

  // Update URL when view or tab changes
  const updateView = (view, tab = null) => {
    setCurrentView(view);
    localStorage.setItem('currentView', view);
    
    const params = new URLSearchParams();
    params.set('view', view);
    
    if (tab) {
      setActiveTab(tab);
      localStorage.setItem('activeTab', tab);
      params.set('tab', tab);
    } else if (view === 'dashboard') {
      params.set('tab', activeTab);
    }
    
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  const updateTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
    
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const view = urlParams.get('view') || 'login';
      const tab = urlParams.get('tab') || 'profile';
      
      setCurrentView(view);
      setActiveTab(tab);
      localStorage.setItem('currentView', view);
      localStorage.setItem('activeTab', tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLogin = async (user, method) => {
    setUserData(user);
    setAuthMethod(method);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('auth_method', method);
    
    // Check if user has existing profile
    await checkUserProfile(user);
  };

  const handleLogout = () => {
    if (authMethod === 'auth0') {
      logout({ returnTo: window.location.origin });
    }
    
    setUserData(null);
    setAuthMethod(null);
    setResumeData(null);
    setCurrentView('login');
    setActiveTab('profile');
    
    localStorage.removeItem('user');
    localStorage.removeItem('auth_method');
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentView');
    localStorage.removeItem('activeTab');
    
    window.history.pushState({}, '', '/');
  };

  const handleResumeUploadComplete = (data) => {
    setResumeData(data);
    updateView('roles');
  };

  const handleRoleSelectionComplete = () => {
    updateView('congratulations');
  };

  const handleGoToDashboard = async () => {
    // Fetch latest profile data before going to dashboard
    if (userData && userData.email) {
      try {
        const profile = await profileAPI.getProfile(userData.email);
        setResumeData(profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    updateView('dashboard', 'profile');
  };

  if (isLoading || checkingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            {isLoading ? 'Loading...' : 'Checking your profile...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {currentView === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}

      {currentView === 'upload' && (
        <ResumeUpload
          userData={userData}
          authMethod={authMethod}
          onNext={handleResumeUploadComplete}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'roles' && (
        <RoleSelection
          userData={resumeData}
          authMethod={authMethod}
          onComplete={handleRoleSelectionComplete}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'congratulations' && (
        <Congratulations onGoToDashboard={handleGoToDashboard} />
      )}

      {currentView === 'dashboard' && (
        <MainDashboard
          userData={userData}
          profileData={resumeData}
          onLogout={handleLogout}
          activeTab={activeTab}
          onTabChange={updateTab}
        />
      )}
    </div>
  );
}

export default App;