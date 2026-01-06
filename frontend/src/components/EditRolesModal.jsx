// src/components/EditRolesModal.jsx
import { useState, useEffect } from 'react';

const EditRolesModal = ({ selectedRoles = [], onSave, onClose }) => {
  const [roles, setRoles] = useState([]);
  const [saving, setSaving] = useState(false);

  const availableRoles = [
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

  useEffect(() => {
    setRoles(selectedRoles);
  }, [selectedRoles]);

  const toggleRole = (roleTitle) => {
    setRoles(prev => {
      if (prev.includes(roleTitle)) {
        return prev.filter(r => r !== roleTitle);
      }
      return [...prev, roleTitle];
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
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Role Preferences</h2>
            <p className="text-gray-600 text-sm mt-1">
              Choose one or more roles that match your career interests
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {availableRoles.map((role) => {
              const isSelected = roles.includes(role.title);
              return (
                <div
                  key={role.id}
                  onClick={() => toggleRole(role.title)}
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
                  <p className={`text-sm ${isSelected ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                    {role.description}
                  </p>
                </div>
              );
            })}
          </div>

          {roles.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Selected Roles ({roles.length}):</h3>
              <div className="flex flex-wrap gap-2">
                {roles.map((roleTitle, index) => {
                  const role = availableRoles.find(r => r.title === roleTitle);
                  return (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                    >
                      <span>{role?.icon || '💼'}</span>
                      <span>{roleTitle}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRole(roleTitle);
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

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={roles.length === 0 || saving}
              className={`
                flex-1 py-3 rounded-lg font-medium transition duration-200
                ${roles.length === 0 || saving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                }
              `}
            >
              {saving ? 'Saving...' : `Save ${roles.length} Role${roles.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRolesModal;