// src/components/EditRolesModal.jsx - Updated to match RoleSelection structure
import { useState, useEffect } from 'react';

const EditRolesModal = ({ selectedRoles = [], onSave, onClose }) => {
  const [roles, setRoles] = useState([]);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    setRoles(selectedRoles);
  }, [selectedRoles]);

  const visibleRoles = showMore ? allRoles : allRoles.slice(0, 12);

  const toggleRole = (role) => {
    setRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      }
      return [...prev, role];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (roles.length === 0) {
      alert('Please select at least one role');
      return;
    }
    setSaving(true);
    try {
      await onSave(roles);
    } catch (error) {
      console.error('Error saving roles:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header - matches MainDashboard gradient */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-3 text-3xl">💼</span>
              Edit Selected Roles
            </h2>
            <p className="text-purple-100 text-sm mt-1">
              Choose one or more roles that match your career interests
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Role Selection Grid */}
          <div className="flex flex-wrap gap-3 mb-6">
            {visibleRoles.map((role) => {
              const isSelected = roles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${isSelected 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md transform scale-105' 
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

          {/* Show More Button */}
          {!showMore && allRoles.length > 12 && (
            <div className="text-center mb-6">
              <button
                type="button"
                onClick={() => setShowMore(true)}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm underline"
              >
                Show {allRoles.length - 12} more roles
              </button>
            </div>
          )}

          {/* Selected Roles Display */}
          {roles.length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center text-lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Selected ({roles.length} role{roles.length !== 1 ? 's' : ''}):
              </h3>
              <div className="flex flex-wrap gap-3">
                {roles.map((role, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition transform hover:scale-105"
                  >
                    {role}
                    <button
                      type="button"
                      onClick={() => toggleRole(role)}
                      className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition"
                      title="Remove role"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex gap-4 sticky bottom-0 bg-white pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={roles.length === 0 || saving}
              className={`
                flex-1 py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2
                ${roles.length === 0 || saving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                }
              `}
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                  </svg>
                  Save {roles.length} Role{roles.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRolesModal;