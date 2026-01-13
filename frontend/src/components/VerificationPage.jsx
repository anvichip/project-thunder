// src/components/VerificationPage.jsx - Dynamic Section Verification
import { useState } from 'react';
import AuthHeader from './AuthHeader';

const VerificationPage = ({ extractedData, userData, authMethod, onConfirm, onBack, onLogout }) => {
  const [sections, setSections] = useState(extractedData.sections || []);

  const handleSectionChange = (sectionIndex, subsectionIndex, dataIndex, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].subsections[subsectionIndex].data[dataIndex] = value;
    setSections(updatedSections);
  };

  const handleSubsectionTitleChange = (sectionIndex, subsectionIndex, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].subsections[subsectionIndex].title = value;
    setSections(updatedSections);
  };

  const handleSubmit = () => {
    if (sections.length === 0) {
      alert('No data to verify');
      return;
    }

    // Validate that critical sections have data
    const hasData = sections.some(section => 
      section.subsections.some(sub => sub.data.length > 0)
    );

    if (!hasData) {
      alert('Please ensure at least one section has data');
      return;
    }

    onConfirm({ sections });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <AuthHeader userData={userData} authMethod={authMethod} onLogout={onLogout} />
      
      <div className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Information</h2>
                <p className="text-gray-600">
                  Please review and correct any information that was extracted incorrectly
                </p>
              </div>
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-200 font-medium"
              >
                ← Back
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Review Required</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Check all fields carefully. Automated parsing may have errors.
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Sections Display */}
            <div className="space-y-6">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-md p-6 border-2 border-purple-200">
                  <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                    <span className="mr-2">
                      {section.section_name.toLowerCase().includes('contact') ? '📧' :
                       section.section_name.toLowerCase().includes('education') ? '🎓' :
                       section.section_name.toLowerCase().includes('experience') || 
                       section.section_name.toLowerCase().includes('work') ? '💼' :
                       section.section_name.toLowerCase().includes('skill') ? '🛠️' :
                       section.section_name.toLowerCase().includes('project') ? '🚀' :
                       section.section_name.toLowerCase().includes('achievement') ? '🏆' :
                       section.section_name.toLowerCase().includes('certification') ? '📜' :
                       section.section_name.toLowerCase().includes('publication') ? '📚' : '📋'}
                    </span>
                    {section.section_name}
                  </h3>

                  {section.subsections.map((subsection, subsectionIndex) => (
                    <div key={subsectionIndex} className="bg-white rounded-xl p-5 mb-4 border border-gray-200">
                      {/* Subsection Title */}
                      {subsection.title && (
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={subsection.title}
                            onChange={(e) => handleSubsectionTitleChange(sectionIndex, subsectionIndex, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                          />
                        </div>
                      )}

                      {/* Data Items */}
                      <div className="space-y-2">
                        {subsection.data.length > 0 && (
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Details
                          </label>
                        )}
                        {subsection.data.map((dataItem, dataIndex) => (
                          <textarea
                            key={dataIndex}
                            value={dataItem}
                            onChange={(e) => handleSectionChange(sectionIndex, subsectionIndex, dataIndex, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                            rows="2"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={onBack}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
              >
                Go Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition duration-200 font-medium"
              >
                Confirm & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;