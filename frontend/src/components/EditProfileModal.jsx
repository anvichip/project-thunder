// src/components/EditProfileModal.jsx - Updated to match MainDashboard structure
import { useState, useEffect } from 'react';
import { cleanText } from '../utils/textCleaner';

const EditProfileModal = ({ profileData, onSave, onClose }) => {
  const [sections, setSections] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profileData && profileData.sections) {
      setSections(JSON.parse(JSON.stringify(profileData.sections))); // Deep copy
    }
  }, [profileData]);

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

  const addDataItem = (sectionIndex, subsectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].subsections[subsectionIndex].data.push('');
    setSections(updatedSections);
  };

  const removeDataItem = (sectionIndex, subsectionIndex, dataIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].subsections[subsectionIndex].data.splice(dataIndex, 1);
    setSections(updatedSections);
  };

  const addSubsection = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].subsections.push({
      title: '',
      data: ['']
    });
    setSections(updatedSections);
  };

  const removeSubsection = (sectionIndex, subsectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].subsections.splice(subsectionIndex, 1);
    setSections(updatedSections);
  };

  // Helper function to get section icon - matches MainDashboard
  const getSectionIcon = (sectionName) => {
    const name = sectionName.toLowerCase();
    if (name.includes('contact') || name.includes('personal') || name.includes('biswajeet')) return '📧';
    if (name.includes('education')) return '🎓';
    if (name.includes('experience') || name.includes('work')) return '💼';
    if (name.includes('skill') || name.includes('technical')) return '🛠️';
    if (name.includes('project')) return '🚀';
    if (name.includes('achievement')) return '🏆';
    if (name.includes('certification') || name.includes('certificate')) return '📜';
    if (name.includes('publication')) return '📚';
    if (name.includes('responsibility') || name.includes('position')) return '📋';
    if (name.includes('coursework') || name.includes('course')) return '📚';
    return '📋';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ sections });
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
            <p className="text-blue-100 text-sm mt-1">Update your resume information</p>
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
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => {
              const cleanedSectionName = cleanText(section.section_name, 'section');
              
              if (!cleanedSectionName) return null;

              return (
                <div key={sectionIndex} className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                  {/* Section Header - matches MainDashboard */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <span className="mr-3 text-2xl">{getSectionIcon(cleanedSectionName)}</span>
                      {cleanedSectionName}
                    </h3>
                  </div>

                  {/* Section Content */}
                  <div className="p-6 space-y-4">
                    {section.subsections.map((subsection, subsectionIndex) => (
                      <div key={subsectionIndex} className="bg-gray-50 rounded-lg p-5 border-l-4 border-blue-500">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Subsection {subsectionIndex + 1}
                          </h4>
                          {section.subsections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSubsection(sectionIndex, subsectionIndex)}
                              className="text-red-500 hover:text-red-700 transition"
                              title="Remove subsection"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>

                        {/* Subsection Title */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={subsection.title}
                            onChange={(e) => handleSubsectionTitleChange(sectionIndex, subsectionIndex, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Enter subsection title"
                          />
                        </div>

                        {/* Data Items */}
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Details
                          </label>
                          {subsection.data.map((dataItem, dataIndex) => (
                            <div key={dataIndex} className="flex items-start gap-2">
                              <div className="flex-shrink-0 mt-3 text-blue-600 font-bold">•</div>
                              <textarea
                                value={dataItem}
                                onChange={(e) => handleSectionChange(sectionIndex, subsectionIndex, dataIndex, e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                                rows="2"
                                placeholder="Enter detail"
                              />
                              <button
                                type="button"
                                onClick={() => removeDataItem(sectionIndex, subsectionIndex, dataIndex)}
                                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex-shrink-0"
                                title="Remove detail"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          
                          <button
                            type="button"
                            onClick={() => addDataItem(sectionIndex, subsectionIndex)}
                            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Detail
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addSubsection(sectionIndex)}
                      className="w-full mt-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add New Subsection
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-4 mt-8 sticky bottom-0 bg-white pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;