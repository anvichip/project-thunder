// src/components/MainDashboard.jsx - Updated with new routes
import { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import EditProfileModal from './EditProfileModal';
import EditRolesModal from './EditRolesModal';
import ResumeTemplateUpload from './ResumeTemplateUpload';
import ResumeEditor from './ResumeEditor';

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
          setFullProfile({
            ...profile.profileData,
            selectedRoles: profile.selectedRoles
          });
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
      setFullProfile({ ...fullProfile, ...updatedData });
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
    { id: 'templates', label: 'Resume Templates', icon: '📄' },
    { id: 'editor', label: 'Resume Editor', icon: '✏️' },
    { id: 'jobs', label: 'Job Matches', icon: '💼' },
    { id: 'applications', label: 'Applications', icon: '📋' },
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
      case 'templates':
        return <ResumeTemplateUpload userData={userData} />;
      case 'editor':
        return <ResumeEditor userData={userData} />;
      case 'jobs':
        return <JobMatchesView />;
      case 'applications':
        return <ApplicationsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <ProfileView profileData={fullProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resume Unlocked
              </h1>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200
                      ${activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                {userData?.picture && (
                  <img
                    src={userData.picture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                  />
                )}
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {fullProfile?.fullName || userData?.username || userData?.name || userData?.email}
                  </p>
                  <p className="text-xs text-gray-500">{fullProfile?.email || userData?.email}</p>
                </div>
              </div>
              
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex overflow-x-auto gap-2 py-3 border-t">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 whitespace-nowrap
                  ${activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={activeTab === 'editor' ? '' : 'max-w-7xl mx-auto p-4 md:p-8'}>
        {renderContent()}
      </main>

      {/* Edit Modals */}
      {showEditProfile && (
        <EditProfileModal
          profileData={fullProfile}
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

// Profile View Component (unchanged)
const ProfileView = ({ profileData, onEditProfile, onEditRoles }) => {
  if (!profileData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <p className="text-gray-600">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard label="Full Name" value={profileData?.fullName} icon="👤" />
          <InfoCard label="Email" value={profileData?.email} icon="📧" />
          <InfoCard label="Phone" value={profileData?.phone} icon="📱" />
          <InfoCard label="LinkedIn" value={profileData?.linkedin} icon="💼" link />
          <InfoCard label="GitHub" value={profileData?.github} icon="🔗" link />
        </div>
      </div>

      {profileData?.skills && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.split(',').map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {profileData?.experience && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Work Experience</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{profileData.experience}</p>
          </div>
        </div>
      )}

      {profileData?.education && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Education</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{profileData.education}</p>
          </div>
        </div>
      )}

      {profileData?.selectedRoles && profileData.selectedRoles.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Selected Roles</h2>
            <button
              onClick={onEditRoles}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Roles
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {profileData.selectedRoles.map((role, index) => (
              <span
                key={index}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium shadow-md"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ label, value, icon, link }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>
      {link && value ? (
        <a
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 hover:underline break-all"
        >
          {value}
        </a>
      ) : (
        <p className="text-gray-800 font-medium break-all">{value || 'Not provided'}</p>
      )}
    </div>
  );
};

const JobMatchesView = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Matches</h2>
    <p className="text-gray-600">Coming soon! We're working on matching you with the best opportunities.</p>
  </div>
);

const ApplicationsView = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Applications</h2>
    <p className="text-gray-600">Track all your job applications here.</p>
  </div>
);

const AnalyticsView = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics</h2>
    <p className="text-gray-600">View your profile analytics and insights.</p>
  </div>
);

const SettingsView = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2>
    <p className="text-gray-600">Manage your account settings and preferences.</p>
  </div>
);

export default MainDashboard;