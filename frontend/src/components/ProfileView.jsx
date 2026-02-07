// src/components/ProfileView.jsx - Updated with mini tabs
import { useState } from 'react';
import ContentFormatter from './ContentFormatter';
import { cleanText } from '../utils/textCleaner';

const ProfileView = ({ profileData, onEditProfile, onEditRoles }) => {
  const [activeSubTab, setActiveSubTab] = useState('overview');

  if (!profileData || !profileData.resumeData) {
    return (
      <div className="card-elevated p-12 text-center scale-in">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-gray-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Profile Data</h3>
          <p className="text-gray-600 mb-6">Upload your resume to get started</p>
          <button className="btn btn-primary">
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  const sections = profileData.resumeData.sections || [];

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

  // Categorize sections
  const categorizedSections = {
    contact: sections.filter(s => {
      const name = s.section_name.toLowerCase();
      return name.includes('contact') || name.includes('personal');
    }),
    experience: sections.filter(s => {
      const name = s.section_name.toLowerCase();
      return name.includes('experience') || name.includes('work') || name.includes('position');
    }),
    education: sections.filter(s => {
      const name = s.section_name.toLowerCase();
      return name.includes('education') || name.includes('academic');
    }),
    skills: sections.filter(s => {
      const name = s.section_name.toLowerCase();
      return name.includes('skill') || name.includes('technical') || name.includes('competenc');
    }),
    other: sections.filter(s => {
      const name = s.section_name.toLowerCase();
      return !name.includes('contact') && 
             !name.includes('personal') && 
             !name.includes('experience') && 
             !name.includes('work') && 
             !name.includes('position') && 
             !name.includes('education') && 
             !name.includes('academic') && 
             !name.includes('skill') && 
             !name.includes('technical') && 
             !name.includes('competenc');
    })
  };

  const subTabs = [
    { id: 'overview', label: 'Overview', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    )},
    { id: 'experience', label: 'Experience', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ), count: categorizedSections.experience.length },
    { id: 'education', label: 'Education', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ), count: categorizedSections.education.length },
    { id: 'skills', label: 'Skills', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ), count: categorizedSections.skills.length },
    { id: 'other', label: 'Other', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ), count: categorizedSections.other.length }
  ];

  const renderSections = (sectionsToRender) => {
    if (!sectionsToRender || sectionsToRender.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-500">No sections available in this category</p>
        </div>
      );
    }

    return sectionsToRender.map((section, sectionIndex) => {
      const cleanedSectionName = cleanText(section.section_name, 'section');
      
      if (!cleanedSectionName) return null;

      return (
        <div 
          key={sectionIndex} 
          className="card-elevated hover-lift overflow-hidden mb-6"
        >
          {/* Section Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                {getSectionIcon(cleanedSectionName)}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">
                  {cleanedSectionName}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {section.subsections?.length || 0} {section.subsections?.length === 1 ? 'entry' : 'entries'}
                </p>
              </div>
            </div>
          </div>

          {/* Section Content */}
          <div className="p-6">
            {section.subsections && section.subsections.length > 0 ? (
              <div className="space-y-6">
                {section.subsections.map((subsection, subIndex) => {
                  const cleanedTitle = cleanText(subsection.title, 'subsection');

                  return (
                    <div key={subIndex} className="group">
                      {/* Subsection Title */}
                      {cleanedTitle && cleanedTitle.trim() !== '' && (
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-1 h-full bg-gradient-to-b from-blue-500 to-teal-500 rounded-full"></div>
                          <h3 className="text-lg font-bold text-gray-900 flex-1">
                            {cleanedTitle}
                          </h3>
                        </div>
                      )}

                      {/* Subsection Data */}
                      {subsection.data && subsection.data.length > 0 ? (
                        <div className="space-y-2 ml-6">
                          {subsection.data.map((item, dataIndex) => {
                            const cleanedItem = cleanText(item, 'bullet');
                            
                            if (!cleanedItem || cleanedItem === 'NA') return null;
                            
                            return (
                              <div 
                                key={dataIndex} 
                                className="flex items-start gap-3 group/item hover:bg-blue-50 p-3 rounded-lg transition-all"
                              >
                                <div className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                                <div className="flex-1 text-gray-700 leading-relaxed">
                                  <ContentFormatter text={cleanedItem} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic ml-6">No data available</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-500">No information available in this section</p>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="card-elevated p-8 fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <span className="badge badge-success">Active</span>
            </div>
            <p className="text-gray-600">
              View and manage your professional resume information
            </p>
          </div>
          
          <button
            onClick={onEditProfile}
            className="btn btn-primary hover-lift"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Mini Tabs Navigation */}
      <div className="card-elevated overflow-hidden fade-in">
        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all whitespace-nowrap
                ${activeSubTab === tab.id
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`
                  ml-1 px-2 py-0.5 rounded-full text-xs font-bold
                  ${activeSubTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              {sections.map((section, sectionIndex) => {
                const cleanedSectionName = cleanText(section.section_name, 'section');
                
                if (!cleanedSectionName) return null;

                return (
                  <div 
                    key={sectionIndex} 
                    className="card hover-lift overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                          {getSectionIcon(cleanedSectionName)}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-white">
                            {cleanedSectionName}
                          </h2>
                          <p className="text-blue-100 text-sm mt-1">
                            {section.subsections?.length || 0} {section.subsections?.length === 1 ? 'entry' : 'entries'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {section.subsections && section.subsections.length > 0 ? (
                        <div className="space-y-6">
                          {section.subsections.map((subsection, subIndex) => {
                            const cleanedTitle = cleanText(subsection.title, 'subsection');

                            return (
                              <div key={subIndex} className="group">
                                {cleanedTitle && cleanedTitle.trim() !== '' && (
                                  <div className="flex items-start gap-3 mb-3">
                                    <div className="w-1 h-full bg-gradient-to-b from-blue-500 to-teal-500 rounded-full"></div>
                                    <h3 className="text-lg font-bold text-gray-900 flex-1">
                                      {cleanedTitle}
                                    </h3>
                                  </div>
                                )}

                                {subsection.data && subsection.data.length > 0 ? (
                                  <div className="space-y-2 ml-6">
                                    {subsection.data.map((item, dataIndex) => {
                                      const cleanedItem = cleanText(item, 'bullet');
                                      
                                      if (!cleanedItem || cleanedItem === 'NA') return null;
                                      
                                      return (
                                        <div 
                                          key={dataIndex} 
                                          className="flex items-start gap-3 group/item hover:bg-blue-50 p-3 rounded-lg transition-all"
                                        >
                                          <div className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                                          <div className="flex-1 text-gray-700 leading-relaxed">
                                            <ContentFormatter text={cleanedItem} />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 italic ml-6">No data available</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                          </div>
                          <p className="text-gray-500">No information available in this section</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Experience Tab */}
          {activeSubTab === 'experience' && renderSections(categorizedSections.experience)}

          {/* Education Tab */}
          {activeSubTab === 'education' && renderSections(categorizedSections.education)}

          {/* Skills Tab */}
          {activeSubTab === 'skills' && renderSections(categorizedSections.skills)}

          {/* Other Tab */}
          {activeSubTab === 'other' && renderSections(categorizedSections.other)}
        </div>
      </div>

      {/* Selected Roles Card */}
      {profileData?.selectedRoles && profileData.selectedRoles.length > 0 && (
        <div className="card-elevated hover-lift overflow-hidden fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  💼
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Selected Roles</h2>
                  <p className="text-purple-100 text-sm mt-1">{profileData.selectedRoles.length} roles selected</p>
                </div>
              </div>
              
              <button
                onClick={onEditRoles}
                className="btn bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {profileData.selectedRoles.map((role, index) => (
                <span
                  key={index}
                  className="badge badge-primary text-sm px-4 py-2"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;