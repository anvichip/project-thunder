// src/components/EditRolesModal.jsx - Updated to match ProfileView theme
import { useState, useEffect } from 'react';

const EditRolesModal = ({ selectedRoles = [], onSave, onClose }) => {
  const [roles, setRoles] = useState([]);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    setRoles(selectedRoles);
  }, [selectedRoles]);

  const filteredRoles = allRoles.filter(role => 
    role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleRoles = showMore ? filteredRoles : filteredRoles.slice(0, 12);

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 scale-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-gray-200">
        {/* Header - Now matches ProfileView style */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Career Roles</h2>
              <p className="text-gray-600 text-sm mt-1">Select roles that match your career goals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-180px)]">
          <div className="p-8 bg-gray-50">
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
              {visibleRoles.map((role) => {
                const isSelected = roles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`
                      relative px-4 py-3 rounded-lg text-sm font-semibold transition-all text-left
                      ${isSelected 
                        ? 'bg-gray-900 text-white shadow-sm border border-gray-900' 
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{role}</span>
                      <div className={`
                        w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ml-2
                        ${isSelected ? 'bg-white/20' : 'bg-gray-100'}
                      `}>
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Show More Button */}
            {!showMore && filteredRoles.length > 12 && (
              <div className="text-center mb-8">
                <button
                  type="button"
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

            {/* Selected Roles Display */}
            {roles.length > 0 && (
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Your Selected Roles
                  </h3>
                  <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-bold text-sm">
                    {roles.length} {roles.length === 1 ? 'Role' : 'Roles'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {roles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded border border-gray-200 text-sm font-semibold"
                    >
                      <span>{role}</span>
                      <button
                        type="button"
                        onClick={() => toggleRole(role)}
                        className="hover:bg-gray-200 rounded-full p-0.5 transition"
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
          </div>

          {/* Footer Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-5 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={roles.length === 0 || saving}
              className={`
                btn flex-1
                ${roles.length === 0 || saving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
                }
              `}
            >
              {saving ? (
                <>
                  <span className="spinner"></span>
                  Saving Roles...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                  </svg>
                  Save {roles.length} {roles.length === 1 ? 'Role' : 'Roles'}
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