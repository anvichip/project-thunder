// src/components/VerificationPage.jsx - Commercial Grade Design
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

    const hasData = sections.some(section => 
      section.subsections.some(sub => sub.data.length > 0)
    );

    if (!hasData) {
      alert('Please ensure at least one section has data');
      return;
    }

    onConfirm({ sections });
  };

  const getSectionIcon = (sectionName) => {
    const name = sectionName.toLowerCase();
    if (name.includes('contact')) return '📧';
    if (name.includes('education')) return '🎓';
    if (name.includes('experience') || name.includes('work')) return '💼';
    if (name.includes('skill')) return '🛠️';
    if (name.includes('project')) return '🚀';
    if (name.includes('achievement')) return '🏆';
    if (name.includes('certification')) return '📜';
    if (name.includes('publication')) return '📚';
    return '📋';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <AuthHeader userData={userData} authMethod={authMethod} onLogout={onLogout} />
      
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 mb-8 border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Verify Your Data</h2>
                  <p className="text-gray-600 text-lg font-medium">
                    Review and perfect your extracted information
                  </p>
                </div>
              </div>
              <button
                onClick={onBack}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 font-bold flex items-center gap-2 group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>

            {/* Alert Banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">⚡ Attention Required</h3>
                  <p className="text-amber-800 font-medium leading-relaxed">
                    AI parsing may not be 100% accurate. Please carefully review each field and make corrections where needed. Your attention to detail ensures the best results.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="group">
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                  {/* Section Header */}
                  <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 px-8 py-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <h3 className="text-2xl font-bold text-white flex items-center relative z-10 tracking-tight">
                      <span className="text-3xl mr-4 filter drop-shadow-lg">{getSectionIcon(section.section_name)}</span>
                      <span>{section.section_name}</span>
                    </h3>
                  </div>

                  {/* Section Content */}
                  <div className="p-8 space-y-6">
                    {section.subsections.map((subsection, subsectionIndex) => (
                      <div key={subsectionIndex} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-7 border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition-all duration-200">
                        {/* Subsection Title */}
                        {subsection.title && (
                          <div className="mb-5">
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                              <span className="uppercase tracking-wide">Title</span>
                            </label>
                            <input
                              type="text"
                              value={subsection.title}
                              onChange={(e) => handleSubsectionTitleChange(sectionIndex, subsectionIndex, e.target.value)}
                              className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-800 font-semibold placeholder:text-gray-400 placeholder:font-normal"
                              placeholder="Enter subsection title"
                            />
                          </div>
                        )}

                        {/* Data Items */}
                        <div className="space-y-4">
                          {subsection.data.length > 0 && (
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="uppercase tracking-wide">Details</span>
                            </label>
                          )}
                          {subsection.data.map((dataItem, dataIndex) => (
                            <div key={dataIndex} className="relative group/item">
                              <textarea
                                value={dataItem}
                                onChange={(e) => handleSectionChange(sectionIndex, subsectionIndex, dataIndex, e.target.value)}
                                className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 text-gray-800 placeholder:text-gray-400 resize-none"
                                rows="3"
                                placeholder="Add detail or achievement"
                              />
                              <div className="absolute top-3 right-3 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                                  Item {dataIndex + 1}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-10 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex gap-5">
              <button
                onClick={onBack}
                className="flex-1 bg-gray-100 text-gray-700 py-5 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-bold text-lg flex items-center justify-center gap-3 group"
              >
                <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Go Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-5 rounded-2xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
              >
                <span>Confirm & Continue</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;