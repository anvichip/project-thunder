// src/components/RoleSelection.jsx - Updated with AuthHeader
import { useState } from 'react';
import { profileAPI } from '../services/api';
import AuthHeader from './AuthHeader';

const RoleSelection = ({ userData, authMethod, onComplete, onLogout }) => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    {
      id: 'sde',
      title: 'Software Development Engineer',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'mle',
      title: 'Machine Learning Engineer',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'ds',
      title: 'Data Scientist',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'de',
      title: 'Data Engineer',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'fe',
      title: 'Frontend Engineer',
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'be',
      title: 'Backend Engineer',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'devops',
      title: 'DevOps Engineer',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'pm',
      title: 'Product Manager',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const toggleRole = (roleId) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      }
      return [...prev, roleId];
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
      const selectedRoleTitles = selectedRoles.map(roleId => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.title : roleId;
      });

      await profileAPI.saveProfile(
        userData.email,
        userData,
        selectedRoleTitles
      );

      setSaving(false);
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.response?.data?.detail || 'Failed to save profile. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <AuthHeader userData={userData} authMethod={authMethod} onLogout={onLogout} />
      
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {roles.map((role) => {
                const isSelected = selectedRoles.includes(role.id);
                return (
                  <div
                    key={role.id}
                    onClick={() => toggleRole(role.id)}
                    className={`
                      relative cursor-pointer rounded-xl p-6 transition-all duration-200 transform hover:scale-105
                      ${isSelected 
                        ? `bg-gradient-to-br ${role.color} text-white shadow-lg` 
                        : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="text-4xl mb-3">{role.icon}</div>
                    <h3 className={`font-bold text-lg mb-2 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {role.title}
                    </h3>
                  </div>
                );
              })}
            </div>

            {selectedRoles.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Selected Roles:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRoles.map(roleId => {
                    const role = roles.find(r => r.id === roleId);
                    return (
                      <span
                        key={roleId}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                      >
                        <span>{role.icon}</span>
                        <span>{role.title}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRole(roleId);
                          }}
                          className="ml-1 hover:bg-blue-700 rounded-full p-0.5"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    );
                  })}
                </div>
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
              {saving ? 'Saving Profile...' : `Continue with ${selectedRoles.length} Role${selectedRoles.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;