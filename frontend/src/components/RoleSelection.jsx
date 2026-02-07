// src/components/RoleSelection.jsx - Updated with progress bar
import { useState } from 'react';
import { profileAPI } from '../services/api';
import AuthHeader from './AuthHeader';
import OnboardingProgressBar from './Onboardingprogressbar';

const RoleSelection = ({ userData, authMethod, onComplete, onLogout }) => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredRoles = searchQuery 
    ? allRoles.filter(role => role.toLowerCase().includes(searchQuery.toLowerCase()))
    : allRoles;

  const visibleRoles = showMore ? filteredRoles : filteredRoles.slice(0, 12);

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
    <div className="min-h-screen bg-gray-50">
      <AuthHeader 
        userData={userData || { email: 'user@example.com' }} 
        authMethod={authMethod} 
        onLogout={onLogout || (() => console.log('Logout clicked'))} 
      />
      
      {/* Progress Bar */}
      <OnboardingProgressBar currentStep={3} />
      
      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500">
              <span className="text-3xl">💼</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Select Your Target Roles</h1>
            <p className="text-lg text-gray-600">
              Choose the positions that match your career interests and expertise
            </p>
          </div>

          {/* Main Card */}
          <div className="card-elevated scale-in">
            {error && (
              <div className="p-6 border-b border-gray-200">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-red-800">{error}</span>
                </div>
              </div>
            )}

            <div className="p-8">
              {/* Search Bar */}
              <div className="mb-8">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for roles..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Role Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                {visibleRoles.map((role, index) => {
                  const isSelected = selectedRoles.includes(role);
                  return (
                    <button
                      key={role}
                      onClick={() => toggleRole(role)}
                      className={`
                        relative px-4 py-3 rounded-lg text-sm font-semibold transition-all text-left
                        ${isSelected 
                          ? 'bg-blue-600 text-white shadow-md border-2 border-blue-600' 
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{role}</span>
                        {isSelected && (
                          <svg className="w-5 h-5 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Show More Button */}
              {!showMore && filteredRoles.length > 12 && (
                <div className="text-center mb-8">
                  <button
                    onClick={() => setShowMore(true)}
                    className="btn btn-secondary"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Show {filteredRoles.length - 12} more roles
                  </button>
                </div>
              )}

              {/* Selected Roles Preview */}
              {selectedRoles.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Selected Roles</h3>
                        <p className="text-sm text-gray-600">{selectedRoles.length} role{selectedRoles.length !== 1 ? 's' : ''} selected</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedRoles.map((role, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold"
                      >
                        {role}
                        <button
                          onClick={() => toggleRole(role)}
                          className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
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
                className="btn btn-primary w-full btn-lg hover-lift"
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
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="card p-6 text-center hover-lift">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Be Specific</h4>
              <p className="text-sm text-gray-600">Choose roles that match your actual experience and skills</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-teal-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Multiple Roles OK</h4>
              <p className="text-sm text-gray-600">You can select multiple positions that interest you</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Update Anytime</h4>
              <p className="text-sm text-gray-600">Change your roles later in your settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;