// src/components/MainDashboard.jsx - FINAL FIXED VERSION
import { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import EditProfileModal from './EditProfileModal';
import EditRolesModal from './EditRolesModal';
import MyResumes from './MyResumes';
import ContentFormatter from './ContentFormatter';
import { cleanText } from '../utils/textCleaner';

const MainDashboard = ({ userData, profileData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [fullProfile, setFullProfile] = useState(profileData);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditRoles, setShowEditRoles] = useState(false);

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

  const handleProfileUpdate = async (updatedData) => {
    try {
      await profileAPI.updateProfile(userData.email, updatedData);
      setFullProfile({ ...fullProfile, resumeData: updatedData });
      setShowEditProfile(false);
      alert('Profile updated successfully!');
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
      alert('Roles updated successfully!');
    } catch (error) {
      console.error('Error updating roles:', error);
      alert('Failed to update roles. Please try again.');
    }
  };

  const navItems = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'my-resumes', label: 'My Resumes', icon: '📄' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
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
        return <MyResumes userData={userData} />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
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
                  flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap font-medium text-sm
                  ${activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {item.label}
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

// Profile View Component - Properly Formatted
const ProfileView = ({ profileData, onEditProfile, onEditRoles }) => {
  if (!profileData || !profileData.resumeData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 text-lg">No profile data available.</p>
          <p className="text-gray-500 text-sm mt-2">Upload your resume to get started</p>
        </div>
      </div>
    );
  }

  const sections = profileData.resumeData.sections || [];

  // Helper function to get section icon
  const getSectionIcon = (sectionName) => {
    const name = sectionName.toLowerCase();
    if (name.includes('contact') || name.includes('personal') || name.includes('biswajeet')) return '📧';
    if (name.includes('education')) return '🎓';
    if (name.includes('experience') || name.includes('work')) return '💼';
    if (name.includes('skill') || name.includes('technical')) return '🛠️';
    if (name.includes('project')) return '🚀';
    if (name.includes('achievement')) return '🏆';
    if (name.includes('certification') || name.includes('certificate')) return '📜';
    if (name.includes('publication')) return '📚';
    if (name.includes('responsibility') || name.includes('position')) return '📋';
    if (name.includes('coursework') || name.includes('course')) return '📚';
    return '📋';
  };

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600 mt-1">View and manage your resume information</p>
          </div>
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Dynamic Sections from Resume */}
      {sections.map((section, sectionIndex) => {
        // Clean section name
        const cleanedSectionName = cleanText(section.section_name, 'section');
        
        // Skip empty sections
        if (!cleanedSectionName) return null;

        return (
          <div key={sectionIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="mr-3 text-3xl">{getSectionIcon(cleanedSectionName)}</span>
                {cleanedSectionName}
              </h2>
            </div>

            {/* Section Content */}
            <div className="p-8">
              {section.subsections && section.subsections.length > 0 ? (
                <div className="space-y-6">
                  {section.subsections.map((subsection, subIndex) => {
                    // Clean subsection title
                    const cleanedTitle = cleanText(subsection.title, 'subsection');

                    return (
                      <div key={subIndex} className="border-l-4 border-blue-500 pl-6">
                        {/* Subsection Title */}
                        {cleanedTitle && cleanedTitle.trim() !== '' && (
                          <h3 className="text-lg font-bold text-gray-800 mb-3">
                            {cleanedTitle}
                          </h3>
                        )}

                        {/* Subsection Data */}
                        {subsection.data && subsection.data.length > 0 ? (
                          <div className="space-y-2">
                            {subsection.data.map((item, dataIndex) => {
                              // Clean the text
                              const cleanedItem = cleanText(item, 'bullet');
                              
                              // Skip empty items
                              if (!cleanedItem || cleanedItem === 'NA') return null;
                              
                              return (
                                <div 
                                  key={dataIndex} 
                                  className="flex items-start gap-3 group hover:bg-blue-50 p-3 rounded-lg transition-colors"
                                >
                                  <span className="text-blue-600 mt-1 flex-shrink-0 font-bold">•</span>
                                  <div className="text-gray-700 leading-relaxed flex-1 break-words">
                                    <ContentFormatter text={cleanedItem} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No data available</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">No information available in this section</p>
              )}
            </div>
          </div>
        );
      })}

      {/* Selected Roles */}
      {profileData?.selectedRoles && profileData.selectedRoles.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-3 text-3xl">💼</span>
              Selected Roles
            </h2>
            <button
              onClick={onEditRoles}
              className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Roles
            </button>
          </div>
          <div className="p-8">
            <div className="flex flex-wrap gap-3">
              {profileData.selectedRoles.map((role, index) => (
                <span
                  key={index}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition transform hover:scale-105"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AnalyticsView = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-2xl">📊</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
        <p className="text-gray-600">View your profile analytics and insights</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
        <div className="text-4xl mb-3">👁️</div>
        <p className="text-sm text-gray-600 mb-1">Profile Views</p>
        <p className="text-3xl font-bold text-gray-800">0</p>
      </div>
      
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
        <div className="text-4xl mb-3">📄</div>
        <p className="text-sm text-gray-600 mb-1">Resumes Created</p>
        <p className="text-3xl font-bold text-gray-800">0</p>
      </div>
      
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
        <div className="text-4xl mb-3">🎯</div>
        <p className="text-sm text-gray-600 mb-1">Applications</p>
        <p className="text-3xl font-bold text-gray-800">0</p>
      </div>
    </div>
  </div>
);

const SettingsView = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
        <span className="text-2xl">⚙️</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>
    </div>

    <div className="space-y-6 mt-8">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Settings</h3>
        <p className="text-gray-600 text-sm">Update your account information and preferences</p>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Privacy Settings</h3>
        <p className="text-gray-600 text-sm">Control who can see your profile and data</p>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Notifications</h3>
        <p className="text-gray-600 text-sm">Manage your email and push notifications</p>
      </div>
    </div>
  </div>
);

export default MainDashboard;