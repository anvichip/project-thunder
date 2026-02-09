// src/components/EditProfileModal.jsx - Updated to match ProfileView theme
import { useState, useEffect } from 'react';
import { cleanText } from '../utils/textCleaner';

const EditProfileModal = ({ profileData, onSave, onClose }) => {
  const [sections, setSections] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profileData && profileData.sections) {
      setSections(JSON.parse(JSON.stringify(profileData.sections)));
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

  const getSectionIcon = (sectionName) => {
    const name = sectionName.toLowerCase();
    if (name.includes('contact') || name.includes('personal')) return '📧';
    if (name.includes('education')) return '🎓';
    if (name.includes('experience') || name.includes('work')) return '💼';
    if (name.includes('skill') || name.includes('technical')) return '🛠️';
    if (name.includes('project')) return '🚀';
    if (name.includes('achievement')) return '🏆';
    if (name.includes('certification')) return '📜';
    if (name.includes('publication')) return '📚';
    if (name.includes('responsibility')) return '📋';
    if (name.includes('coursework')) return '📚';
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 scale-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden border border-gray-200">
        {/* Header - Now matches ProfileView style */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Your Profile</h2>
              <p className="text-gray-600 text-sm mt-1">Update your professional information</p>
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
          <div className="p-8 space-y-6 bg-gray-50">
            {sections.map((section, sectionIndex) => {
              const cleanedSectionName = cleanText(section.section_name, 'section');
              
              if (!cleanedSectionName) return null;

              return (
                <div key={sectionIndex} className="group">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Section Header - ProfileView style */}
                    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                      <h3 className="text-base font-semibold text-gray-900 flex items-center gap-3">
                        <span className="text-xl">{getSectionIcon(cleanedSectionName)}</span>
                        <span>{cleanedSectionName}</span>
                      </h3>
                    </div>

                    {/* Section Content */}
                    <div className="p-6 space-y-6">
                      {section.subsections.map((subsection, subsectionIndex) => (
                        <div key={subsectionIndex} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                                <span className="text-gray-700 font-bold text-sm">{subsectionIndex + 1}</span>
                              </div>
                              <h4 className="text-sm font-semibold text-gray-700 uppercase">
                                Subsection {subsectionIndex + 1}
                              </h4>
                            </div>
                            {section.subsections.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSubsection(sectionIndex, subsectionIndex)}
                                className="text-red-600 hover:text-white hover:bg-red-600 rounded-lg p-2 transition-all"
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              value={subsection.title}
                              onChange={(e) => handleSubsectionTitleChange(sectionIndex, subsectionIndex, e.target.value)}
                              className="input"
                              placeholder="Enter a descriptive title"
                            />
                          </div>

                          {/* Data Items */}
                          <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700">
                              Details
                            </label>
                            {subsection.data.map((dataItem, dataIndex) => (
                              <div key={dataIndex} className="flex items-start gap-3">
                                <textarea
                                  value={dataItem}
                                  onChange={(e) => handleSectionChange(sectionIndex, subsectionIndex, dataIndex, e.target.value)}
                                  className="input flex-1"
                                  rows="2"
                                  placeholder="Add detail or achievement"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeDataItem(sectionIndex, subsectionIndex, dataIndex)}
                                  className="btn-ghost btn-icon text-red-600 hover:bg-red-50"
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
                              className="btn btn-secondary text-sm"
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
                        className="btn btn-primary w-full"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New Subsection
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
              disabled={saving}
              className="btn btn-primary flex-1"
            >
              {saving ? (
                <>
                  <span className="spinner"></span>
                  Saving Changes...
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