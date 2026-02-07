// src/components/ProfileView.jsx - Minimal Professional Dashboard Design
import { useState } from 'react';
import ContentFormatter from './ContentFormatter';
import { cleanText } from '../utils/textCleaner';

const ProfileView = ({ profileData, onEditProfile, onEditRoles, userData }) => {
  const [activeSubTab, setActiveSubTab] = useState('overview');

  if (!profileData || !profileData.resumeData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Profile Data</h3>
          <p className="text-gray-600 mb-6">Upload your resume to get started</p>
          <button className="btn btn-primary">Upload Resume</button>
        </div>
      </div>
    );
  }

  const sections = profileData.resumeData.sections || [];

  const filterSectionsWithData = (sections) => {
    return sections.filter(section => {
      const subsections = section.subsections || [];
      return subsections.some(sub => {
        const data = sub.data || [];
        return data.length > 0 && data.some(item => item && item.trim());
      });
    });
  };

  // Categorize sections
  const categorizedSections = {
    contact: filterSectionsWithData(sections.filter(s => {
      const name = s.section_name.toLowerCase();
      return name.includes('contact') || name.includes('personal');
    })),
    experience: filterSectionsWithData(sections.filter(s => {
      const name = s.section_name.toLowerCase();
      return name.includes('experience') || name.includes('work') || name.includes('position');
    })),
    education: filterSectionsWithData(sections.filter(s => {
      const name = s.section_name.toLowerCase();
      return name.includes('education') || name.includes('academic');
    })),
    skills: filterSectionsWithData(sections.filter(s => {
      const name = s.section_name.toLowerCase();
      return name.includes('skill') || name.includes('technical') || name.includes('competenc');
    })),
    other: filterSectionsWithData(sections.filter(s => {
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
    }))
  };

  const subTabs = [
    { 
      id: 'overview', 
      label: 'Overview',
      count: filterSectionsWithData(sections).length
    },
    { 
      id: 'experience', 
      label: 'Experience',
      count: categorizedSections.experience.length 
    },
    { 
      id: 'education', 
      label: 'Education',
      count: categorizedSections.education.length 
    },
    { 
      id: 'skills', 
      label: 'Skills',
      count: categorizedSections.skills.length 
    },
    { 
      id: 'other', 
      label: 'Other',
      count: categorizedSections.other.length 
    }
  ];

  const renderSkillsSection = (section) => {
    const cleanedSectionName = cleanText(section.section_name, 'section');
    if (!cleanedSectionName) return null;

    const subsections = section.subsections || [];
    const validSubsections = subsections.filter(sub => {
      const data = sub.data || [];
      return data.length > 0 && data.some(item => item && item.trim());
    });

    if (validSubsections.length === 0) return null;

    return (
      <div key={section.section_name} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{cleanedSectionName}</h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {validSubsections.map((subsection, subIndex) => {
              const cleanedTitle = cleanText(subsection.title, 'subsection');
              const data = subsection.data || [];
              const cleanedData = data.filter(item => item && item.trim()).map(item => cleanText(item, 'bullet'));

              if (cleanedData.length === 0) return null;

              return (
                <div key={subIndex}>
                  {cleanedTitle && cleanedTitle.trim() !== '' && (
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">{cleanedTitle}</h3>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {cleanedData.map((item, dataIndex) => (
                      <span
                        key={dataIndex}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded border border-gray-200"
                      >
                        <ContentFormatter text={item} />
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderRegularSection = (section) => {
    const cleanedSectionName = cleanText(section.section_name, 'section');
    if (!cleanedSectionName) return null;

    const subsections = section.subsections || [];
    const validSubsections = subsections.filter(sub => {
      const data = sub.data || [];
      return data.length > 0 && data.some(item => item && item.trim());
    });

    if (validSubsections.length === 0) return null;

    return (
      <div key={section.section_name} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{cleanedSectionName}</h2>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {validSubsections.map((subsection, subIndex) => {
              const cleanedTitle = cleanText(subsection.title, 'subsection');
              const data = subsection.data || [];
              const cleanedData = data.filter(item => item && item.trim()).map(item => cleanText(item, 'bullet'));

              if (cleanedData.length === 0 && !cleanedTitle) return null;

              return (
                <div key={subIndex} className="pb-6 last:pb-0 border-b last:border-b-0 border-gray-100">
                  {cleanedTitle && cleanedTitle.trim() !== '' && (
                    <h3 className="text-base font-semibold text-gray-900 mb-2">{cleanedTitle}</h3>
                  )}

                  {cleanedData.length > 0 && (
                    <div className="space-y-2">
                      {cleanedData.map((item, dataIndex) => (
                        <div 
                          key={dataIndex} 
                          className="flex items-start gap-3 text-sm"
                        >
                          <div className="w-1.5 h-1.5 mt-2 rounded-full bg-gray-400 flex-shrink-0"></div>
                          <div className="flex-1 text-gray-700 leading-relaxed">
                            <ContentFormatter text={item} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSections = (sectionsToRender) => {
    if (!sectionsToRender || sectionsToRender.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No sections available</p>
        </div>
      );
    }

    return sectionsToRender.map((section) => {
      const sectionName = section.section_name?.toLowerCase() || '';
      
      if (sectionName.includes('skill') || sectionName.includes('technical')) {
        return renderSkillsSection(section);
      } else {
        return renderRegularSection(section);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {userData?.picture ? (
              <img
                src={userData.picture}
                alt="Profile"
                className="w-20 h-20 rounded-full ring-4 ring-gray-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              {userData?.name || userData?.username || 'My Profile'}
            </h1>
            <p className="text-sm text-gray-600 mb-3">{userData?.email}</p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-gray-600">{filterSectionsWithData(sections).length} sections</span>
              </div>
              
              {profileData?.selectedRoles && profileData.selectedRoles.length > 0 && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">{profileData.selectedRoles.length} roles</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Edit Button */}
          <button
            onClick={onEditProfile}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all whitespace-nowrap
                ${activeSubTab === tab.id
                  ? 'bg-white text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`
                  px-2 py-0.5 rounded text-xs font-medium
                  ${activeSubTab === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'}
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
            <div className="space-y-4">
              {filterSectionsWithData(sections).map((section) => {
                const sectionName = section.section_name?.toLowerCase() || '';
                
                if (sectionName.includes('skill') || sectionName.includes('technical')) {
                  return renderSkillsSection(section);
                } else {
                  return renderRegularSection(section);
                }
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Target Roles</h2>
              <p className="text-sm text-gray-600 mt-0.5">{profileData.selectedRoles.length} selected</p>
            </div>
            
            <button
              onClick={onEditRoles}
              className="btn btn-secondary text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {profileData.selectedRoles.map((role, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded border border-gray-200"
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