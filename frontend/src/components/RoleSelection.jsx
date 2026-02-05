// src/components/RoleSelection.jsx - Commercial Redesign
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
    setError('');
  };

  const handleSubmit = async () => {
    if (selectedRoles.length === 0) {
      setError('Please select at least one role');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const email = userData?.email || 
                   (userData?.user ? userData.user.email : null) || 
                   'user@example.com';
      
      let resumeData;
      if (userData?.sections) {
        resumeData = { sections: userData.sections };
      } else if (userData?.resumeData?.sections) {
        resumeData = userData.resumeData;
      } else if (userData?.resumeData) {
        resumeData = userData.resumeData;
      } else {
        resumeData = { sections: [] };
      }
      
      await profileAPI.saveProfile(email, resumeData, selectedRoles);
      setSaving(false);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.response?.data?.detail || error.message || 'Failed to save profile');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <AuthHeader 
        userData={userData || { email: 'user@example.com' }} 
        authMethod={authMethod} 
        onLogout={onLogout || (() => console.log('Logout clicked'))} 
      />
      
      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl animated-gradient shadow-glow">
              <span className="text-4xl">💼</span>
            </div>
            <h1 className="text-5xl font-bold gradient-text mb-4">Select Your Roles</h1>
            <p className="text-xl text-neutral-600">
              Choose the positions that match your career interests
            </p>
          </div>

          {/* Main Card */}
          <div className="card scale-in">
            {error && (
              <div className="p-6 border-b-2 border-red-100">
                <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold text-red-800">{error}</span>
                </div>
              </div>
            )}

            <div className="p-8">
              {/* Role Selection Grid */}
              <div className="flex flex-wrap gap-3 mb-8">
                {visibleRoles.map((role, index) => {
                  const isSelected = selectedRoles.includes(role);
                  return (
                    <button
                      key={role}
                      onClick={() => toggleRole(role)}
                      className={`
                        group relative px-5 py-3 rounded-xl font-semibold text-sm
                        transition-all duration-300 stagger-item
                        ${isSelected 
                          ? 'bg-gradient-to-r from-primary-600 to-accent-purple text-white shadow-lg transform scale-105' 
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:scale-105'
                        }
                      `}
                      style={{ animationDelay: `${index * 0.02}s` }}
                    >
                      {role}
                      {isSelected && (
                        <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Show More Button */}
              {!showMore && allRoles.length > 12 && (
                <div className="text-center mb-8">
                  <button
                    onClick={() => setShowMore(true)}
                    className="btn btn-secondary"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Show {allRoles.length - 12} more roles
                  </button>
                </div>
              )}

              {/* Selected Roles Preview */}
              {selectedRoles.length > 0 && (
                <div className="bg-gradient-to-br from-primary-50 to-accent-purple/10 rounded-2xl p-6 border-2 border-primary-200 mb-8 bounce-in">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 text-lg">Selected Roles</h3>
                        <p className="text-sm text-neutral-600">{selectedRoles.length} role{selectedRoles.length !== 1 ? 's' : ''} selected</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedRoles.map((role, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-purple text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md hover-lift"
                      >
                        {role}
                        <button
                          onClick={() => toggleRole(role)}
                          className="ml-1 hover:bg-white/20 rounded-full p-1 transition"
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

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={selectedRoles.length === 0 || saving}
                className="btn btn-primary w-full py-5 text-lg hover-lift shadow-xl"
              >
                {saving ? (
                  <span className="flex items-center gap-3">
                    <span className="spinner"></span>
                    Creating your profile...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    {selectedRoles.length > 0 ? `Continue with ${selectedRoles.length} role${selectedRoles.length !== 1 ? 's' : ''}` : 'Select at least one role'}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="card p-6 text-center hover-lift">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-bold text-neutral-900 mb-1">Be Specific</h4>
              <p className="text-sm text-neutral-600">Choose roles that match your actual experience</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h4 className="font-bold text-neutral-900 mb-1">Multiple Roles</h4>
              <p className="text-sm text-neutral-600">You can select multiple positions</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="font-bold text-neutral-900 mb-1">Update Anytime</h4>
              <p className="text-sm text-neutral-600">Change your roles later in settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;