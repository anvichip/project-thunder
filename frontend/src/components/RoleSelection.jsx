// src/components/RoleSelection.jsx - Updated with AuthHeader
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
  };

  const handleSubmit = async () => {
    if (selectedRoles.length === 0) {
      setError('Please select at least one role');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await profileAPI.saveProfile(
        userData?.email || 'user@example.com',
        userData || {},
        selectedRoles
      );

      setSaving(false);
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.response?.data?.detail || 'Failed to save profile. Please try again.');
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
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
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
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {role}
                    {isSelected && (
                      <span className="ml-2 inline-block">+</span>
                    )}
                    {!isSelected && (
                      <span className="ml-2 inline-block text-gray-400">+</span>
                    )}
                  </button>
                );
              })}
            </div>

            {!showMore && allRoles.length > 12 && (
              <div className="text-center mb-6">
                <button
                  onClick={() => setShowMore(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  view more
                </button>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={selectedRoles.length === 0 || saving}
              className={`
                w-full py-4 rounded-xl font-semibold text-lg transition duration-200
                ${selectedRoles.length === 0 || saving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                }
              `}
            >
              {saving ? 'Saving...' : `Continue with ${selectedRoles.length} role${selectedRoles.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;