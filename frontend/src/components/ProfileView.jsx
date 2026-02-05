// src/components/ProfileView.jsx - Commercial Redesign
import ContentFormatter from './ContentFormatter';
import { cleanText } from '../utils/textCleaner';

const ProfileView = ({ profileData, onEditProfile, onEditRoles }) => {
  if (!profileData || !profileData.resumeData) {
    return (
      <div className="card p-12 text-center scale-in">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
            <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">No Profile Data</h3>
          <p className="text-neutral-600 mb-6">Upload your resume to get started</p>
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

  const getSectionColor = (index) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500',
      'from-green-500 to-emerald-500',
      'from-indigo-500 to-blue-500',
      'from-pink-500 to-rose-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="card card-glow p-8 fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-4xl font-bold gradient-text">My Profile</h1>
              <span className="badge badge-success">Active</span>
            </div>
            <p className="text-neutral-600 text-lg">
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

      {/* Dynamic Sections */}
      {sections.map((section, sectionIndex) => {
        const cleanedSectionName = cleanText(section.section_name, 'section');
        
        if (!cleanedSectionName) return null;

        return (
          <div 
            key={sectionIndex} 
            className="card hover-lift overflow-hidden stagger-item"
            style={{ animationDelay: `${sectionIndex * 0.1}s` }}
          >
            {/* Section Header */}
            <div className={`bg-gradient-to-r ${getSectionColor(sectionIndex)} p-6 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12"></div>
              
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
                  {getSectionIcon(cleanedSectionName)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">
                    {cleanedSectionName}
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    {section.subsections?.length || 0} {section.subsections?.length === 1 ? 'entry' : 'entries'}
                  </p>
                </div>
              </div>
            </div>

            {/* Section Content */}
            <div className="p-8">
              {section.subsections && section.subsections.length > 0 ? (
                <div className="space-y-8">
                  {section.subsections.map((subsection, subIndex) => {
                    const cleanedTitle = cleanText(subsection.title, 'subsection');

                    return (
                      <div key={subIndex} className="group">
                        {/* Subsection Title */}
                        {cleanedTitle && cleanedTitle.trim() !== '' && (
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-1 h-full bg-gradient-to-b from-primary-500 to-accent-purple rounded-full"></div>
                            <h3 className="text-xl font-bold text-neutral-900 flex-1">
                              {cleanedTitle}
                            </h3>
                          </div>
                        )}

                        {/* Subsection Data */}
                        {subsection.data && subsection.data.length > 0 ? (
                          <div className="space-y-3 ml-8">
                            {subsection.data.map((item, dataIndex) => {
                              const cleanedItem = cleanText(item, 'bullet');
                              
                              if (!cleanedItem || cleanedItem === 'NA') return null;
                              
                              return (
                                <div 
                                  key={dataIndex} 
                                  className="flex items-start gap-4 group/item hover:bg-primary-50/50 p-4 rounded-xl transition-all duration-200"
                                >
                                  <div className="w-2 h-2 mt-2 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex-shrink-0"></div>
                                  <div className="flex-1 text-neutral-700 leading-relaxed">
                                    <ContentFormatter text={cleanedItem} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-neutral-500 italic ml-8">No data available</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-neutral-500">No information available in this section</p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Selected Roles Card */}
      {profileData?.selectedRoles && profileData.selectedRoles.length > 0 && (
        <div className="card hover-lift overflow-hidden fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
                  💼
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Selected Roles</h2>
                  <p className="text-white/80 text-sm mt-1">{profileData.selectedRoles.length} roles selected</p>
                </div>
              </div>
              
              <button
                onClick={onEditRoles}
                className="btn bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex flex-wrap gap-3">
              {profileData.selectedRoles.map((role, index) => (
                <span
                  key={index}
                  className="badge badge-primary text-sm px-4 py-2 hover-lift"
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