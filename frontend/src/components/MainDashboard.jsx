// src/components/MainDashboard.jsx - UPDATED IMPORT
import { useState, useEffect } from 'react';
import { profileAPI, resumeAPI } from '../services/api'; // FIXED: Add resumeAPI
import EditProfileModal from './EditProfileModal';
import EditRolesModal from './EditRolesModal';
import MyResumes from './MyResumes';
import AnalyticsView from './AnalyticsView';
import ProfileView from './ProfileView';
import SettingsView from './SettingsView';
import JDMatcher from './JDMatcher'

const MainDashboard = ({ userData, profileData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [fullProfile, setFullProfile] = useState(profileData);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditRoles, setShowEditRoles] = useState(false);
  const [resumeNeedsRefresh, setResumeNeedsRefresh] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (userData?.email) {
        try {
          const profile = await profileAPI.getProfile(userData.email);
          setFullProfile(profile);
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userData]);

  useEffect(() => {
    if (activeTab === 'my-resumes' && resumeNeedsRefresh) {
      console.log('🔄 Resume tab activated after profile change - triggering refresh');
      setResumeNeedsRefresh(false);
    }
  }, [activeTab, resumeNeedsRefresh]);

  const handleProfileUpdate = async (updatedData) => {
    try {
      await profileAPI.updateProfile(userData.email, updatedData);
      setFullProfile({ ...fullProfile, resumeData: updatedData });
      setShowEditProfile(false);
      
      setResumeNeedsRefresh(true);
      
      alert('Profile updated successfully! Your resume will be updated automatically.');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleRolesUpdate = async (updatedRoles) => {
    try {
      await profileAPI.updateRoles(userData.email, updatedRoles);
      setFullProfile({ ...fullProfile, selectedRoles: updatedRoles });
      setShowEditRoles(false);
      
      setResumeNeedsRefresh(true);
      
      alert('Roles updated successfully! Your resume will be updated automatically.');
    } catch (error) {
      console.error('Error updating roles:', error);
      alert('Failed to update roles. Please try again.');
    }
  };

  const navItems = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'my-resumes', label: 'My Resumes', icon: '📄', badge: resumeNeedsRefresh ? 'Updated' : null },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'jd-matcher', label: 'JD Matcher', icon: '⚙️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const renderContent = () => {
    if (loading && activeTab === 'profile') {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return (
          <ProfileView 
            profileData={fullProfile}
            onEditProfile={() => setShowEditProfile(true)}
            onEditRoles={() => setShowEditRoles(true)}
          />
        );
      case 'my-resumes':
        return <MyResumes userData={userData} key={resumeNeedsRefresh ? Date.now() : 'stable'} />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      case 'jd-matcher':
        return <JDMatcher />;
      default:
        return <ProfileView profileData={fullProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resume Unlocked
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
                {userData?.picture && (
                  <img
                    src={userData.picture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                  />
                )}
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                    {userData?.name || userData?.username || userData?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{userData?.email}</p>
                </div>
              </div>
              
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto gap-2 py-3 border-t scrollbar-hide">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  relative flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap font-medium text-sm
                  ${activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {item.label}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Modals */}
      {showEditProfile && (
        <EditProfileModal
          profileData={fullProfile?.resumeData}
          onSave={handleProfileUpdate}
          onClose={() => setShowEditProfile(false)}
        />
      )}

      {showEditRoles && (
        <EditRolesModal
          selectedRoles={fullProfile?.selectedRoles || []}
          onSave={handleRolesUpdate}
          onClose={() => setShowEditRoles(false)}
        />
      )}
    </div>
  );
};

export default MainDashboard;