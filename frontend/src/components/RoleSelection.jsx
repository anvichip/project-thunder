// src/components/RoleSelection.jsx - FIXED VERSION
import { useState } from 'react';
import { profileAPI } from '../services/api';
import AuthHeader from './AuthHeader';

const RoleSelection = ({ userData, authMethod, onComplete, onLogout }) => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showMore, setShowMore] = useState(false);

  const allRoles = [
    'Software Engineer',
    'Backend Developer',
    'Frontend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Machine Learning Engineer',
    'AI Engineer',
    'Data Analyst',
    'Big Data Engineer',
    'DevOps Engineer',
    'Site Reliability Engineer (SRE)',
    'Cloud Engineer',
    'Platform Engineer',
    'Embedded Systems Engineer',
    'Mobile App Developer (Android/iOS)',
    'Game Developer',
    'Computer Vision Engineer',
    'NLP Engineer',
    'MLOps Engineer',
    'Database Administrator (DBA)',
    'Systems Engineer',
    'Network Engineer',
    'Cybersecurity Engineer',
    'Application Security Engineer',
    'QA / Automation Test Engineer',
    'Performance Test Engineer',
    'Solutions Architect',
    'Technical Product Manager',
    'Business Intelligence (BI) Engineer',
    'Research Engineer'
  ];

  const visibleRoles = showMore ? allRoles : allRoles.slice(0, 12);

  const toggleRole = (role) => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      }
      return [...prev, role];
    });
    setError(''); // Clear error when user selects a role
  };

  const handleSubmit = async () => {
    if (selectedRoles.length === 0) {
      setError('Please select at least one role');
      return;
    }

    setSaving(true);
    setError('');

    try {
      console.log('Saving profile with data:', userData);
      
      // Extract email - handle different userData structures
      const email = userData?.email || 
                   (userData?.user ? userData.user.email : null) || 
                   'user@example.com';
      
      // Extract resume sections - handle different structures
      let resumeData;
      if (userData?.sections) {
        // Direct sections from ResumeUpload
        resumeData = { sections: userData.sections };
      } else if (userData?.resumeData?.sections) {
        // Nested resumeData
        resumeData = userData.resumeData;
      } else if (userData?.resumeData) {
        // resumeData without sections wrapper
        resumeData = userData.resumeData;
      } else {
        // Fallback - create empty structure
        console.warn('No resume data found, using empty structure');
        resumeData = { sections: [] };
      }

      console.log('Submitting to API:', {
        email,
        resumeData,
        selectedRoles
      });
      
      const response = await profileAPI.saveProfile(
        email,
        resumeData,
        selectedRoles
      );

      console.log('Profile saved successfully:', response);
      setSaving(false);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      console.error('Error details:', error.response?.data);
      setError(
        error.response?.data?.detail || 
        error.message || 
        'Failed to save profile. Please try again.'
      );
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <AuthHeader 
        userData={userData || { email: 'user@example.com' }} 
        authMethod={authMethod} 
        onLogout={onLogout || (() => console.log('Logout clicked'))} 
      />
      
      <div className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Your Roles</h2>
              <p className="text-gray-600">
                Choose one or more roles that match your career interests
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              {visibleRoles.map((role) => {
                const isSelected = selectedRoles.includes(role);
                return (
                  <button
                    key={role}
                    onClick={() => toggleRole(role)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${isSelected 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md transform scale-105' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {role}
                    {isSelected && (
                      <span className="ml-2 inline-block">✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            {!showMore && allRoles.length > 12 && (
              <div className="text-center mb-6">
                <button
                  onClick={() => setShowMore(true)}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm underline"
                >
                  Show {allRoles.length - 12} more roles
                </button>
              </div>
            )}

            {selectedRoles.length > 0 && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-indigo-800 mb-2">
                  Selected ({selectedRoles.length}):
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRoles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {role}
                      <button
                        onClick={() => toggleRole(role)}
                        className="hover:bg-indigo-700 rounded-full p-0.5"
                        title="Remove"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={selectedRoles.length === 0 || saving}
              className={`
                w-full py-4 rounded-xl font-semibold text-lg transition duration-200 shadow-lg
                ${selectedRoles.length === 0 || saving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02]'
                }
              `}
            >
              {saving ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Profile...
                </span>
              ) : `Continue with ${selectedRoles.length} role${selectedRoles.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;