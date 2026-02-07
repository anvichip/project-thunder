// src/components/MainDashboard.jsx - Updated with Documentation and state management
import { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import EditProfileModal from './EditProfileModal';
import EditRolesModal from './EditRolesModal';
import MyResumes from './MyResumes';
import ProfileView from './ProfileView';
import AnalyticsDashboard from './AnalyticsView';
import JDMatcher from './JDMatcher';
import Documentation from './Documentation';

const MainDashboard = ({ userData, profileData, onLogout, activeTab, onTabChange }) => {
  const [fullProfile, setFullProfile] = useState(profileData);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditRoles, setShowEditRoles] = useState(false);
  const [resumeNeedsRefresh, setResumeNeedsRefresh] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      setResumeNeedsRefresh(false);
    }
  }, [activeTab, resumeNeedsRefresh]);

  const handleProfileUpdate = async (updatedData) => {
    try {
      await profileAPI.updateProfile(userData.email, updatedData);
      setFullProfile({ ...fullProfile, resumeData: updatedData });
      setShowEditProfile(false);
      setResumeNeedsRefresh(true);
      
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'error');
    }
  };

  const handleRolesUpdate = async (updatedRoles) => {
    try {
      await profileAPI.updateRoles(userData.email, updatedRoles);
      setFullProfile({ ...fullProfile, selectedRoles: updatedRoles });
      setShowEditRoles(false);
      setResumeNeedsRefresh(true);
      
      showToast('Roles updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating roles:', error);
      showToast('Failed to update roles', 'error');
    }
  };

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-8 right-8 z-50 px-6 py-4 rounded-lg shadow-xl scale-in ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    } text-white font-semibold`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const navItems = [
    { 
      id: 'profile', 
      label: 'My Profile', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'my-resumes', 
      label: 'My Resumes', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      badge: resumeNeedsRefresh ? 'Updated' : null 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'jd-matcher', 
      label: 'JD Matcher', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    { 
      id: 'docs', 
      label: 'Documentation', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  const renderContent = () => {
    if (loading && activeTab === 'profile') {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="spinner w-16 h-16 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your profile...</p>
          </div>
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
        return <AnalyticsDashboard />;
      case 'jd-matcher':
        return <JDMatcher />;
      case 'docs':
        return <Documentation />;
      default:
        return <ProfileView profileData={fullProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="glass sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="btn-ghost btn-icon lg:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="font-bold text-xl text-gray-900 hidden sm:block">Resume Unlocked</span>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                {userData?.picture && (
                  <img
                    src={userData.picture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full ring-2 ring-blue-400"
                  />
                )}
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                    {userData?.name || userData?.username || userData?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{userData?.email}</p>
                </div>
              </div>
              
              <button
                onClick={onLogout}
                className="btn btn-secondary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] z-30
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  font-semibold text-sm transition-all
                  ${activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="badge badge-success text-xs px-2 py-0.5">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-xs font-semibold text-gray-900 mb-1">Need help?</p>
              <p className="text-xs text-gray-600 mb-3">Check our documentation</p>
              <button 
                onClick={() => {
                  onTabChange('docs');
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className="btn btn-primary w-full text-xs py-2"
              >
                View Docs
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        </main>
      </div>

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

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default MainDashboard;