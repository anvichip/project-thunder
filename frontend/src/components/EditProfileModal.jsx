// src/components/EditProfileModal.jsx - Commercial Grade Design
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden border border-gray-100">
        {/* Premium Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-10 py-8 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Edit Your Profile</h2>
              <p className="text-indigo-100 text-sm mt-1 font-medium">Refine your professional story</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/90 hover:text-white hover:bg-white/20 rounded-2xl p-3 transition-all duration-200 group"
          >
            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-180px)]">
          <div className="p-10 space-y-8 bg-gradient-to-br from-gray-50 to-white">
            {sections.map((section, sectionIndex) => {
              const cleanedSectionName = cleanText(section.section_name, 'section');
              
              if (!cleanedSectionName) return null;

              return (
                <div key={sectionIndex} className="group">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                    {/* Section Header */}
                    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-8 py-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <h3 className="text-2xl font-bold text-white flex items-center relative z-10">
                        <span className="mr-4 text-3xl filter drop-shadow-lg">{getSectionIcon(cleanedSectionName)}</span>
                        <span className="tracking-tight">{cleanedSectionName}</span>
                      </h3>
                    </div>

                    {/* Section Content */}
                    <div className="p-8 space-y-6">
                      {section.subsections.map((subsection, subsectionIndex) => (
                        <div key={subsectionIndex} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex justify-between items-start mb-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <span className="text-indigo-600 font-bold text-sm">{subsectionIndex + 1}</span>
                              </div>
                              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                                Subsection {subsectionIndex + 1}
                              </h4>
                            </div>
                            {section.subsections.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSubsection(sectionIndex, subsectionIndex)}
                                className="text-red-500 hover:text-white hover:bg-red-500 rounded-xl p-2 transition-all duration-200 group/btn"
                                title="Remove subsection"
                              >
                                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                          </div>

                          {/* Subsection Title */}
                          <div className="mb-5">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                              Title
                            </label>
                            <input
                              type="text"
                              value={subsection.title}
                              onChange={(e) => handleSubsectionTitleChange(sectionIndex, subsectionIndex, e.target.value)}
                              className="w-full px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-800 font-medium placeholder:text-gray-400"
                              placeholder="Enter a descriptive title"
                            />
                          </div>

                          {/* Data Items */}
                          <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                              Details
                            </label>
                            {subsection.data.map((dataItem, dataIndex) => (
                              <div key={dataIndex} className="flex items-start gap-3 group/item">
                                <div className="flex-shrink-0 mt-4">
                                  <div className="w-2 h-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full"></div>
                                </div>
                                <textarea
                                  value={dataItem}
                                  onChange={(e) => handleSectionChange(sectionIndex, subsectionIndex, dataIndex, e.target.value)}
                                  className="flex-1 px-5 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 resize-none text-gray-800 placeholder:text-gray-400"
                                  rows="2"
                                  placeholder="Add detail or achievement"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeDataItem(sectionIndex, subsectionIndex, dataIndex)}
                                  className="px-4 py-3.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200 flex-shrink-0 group/del"
                                  title="Remove detail"
                                >
                                  <svg className="w-5 h-5 group-hover/del:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                            
                            <button
                              type="button"
                              onClick={() => addDataItem(sectionIndex, subsectionIndex)}
                              className="mt-3 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg group/add"
                            >
                              <svg className="w-5 h-5 group-hover/add:rotate-90 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
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
                        className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl group/sub"
                      >
                        <svg className="w-6 h-6 group-hover/sub:rotate-90 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
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
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-10 py-6 flex gap-4 shadow-2xl">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl hover:bg-gray-200 transition-all duration-200 font-bold text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-200 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Changes...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EditProfileModal;