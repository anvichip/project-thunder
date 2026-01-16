import ContentFormatter from './ContentFormatter';
import { cleanText } from '../utils/textCleaner';

const ProfileView = ({ profileData, onEditProfile, onEditRoles }) => {
  if (!profileData || !profileData.resumeData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 text-lg">No profile data available.</p>
          <p className="text-gray-500 text-sm mt-2">Upload your resume to get started</p>
        </div>
      </div>
    );
  }

  const sections = profileData.resumeData.sections || [];

  // Helper function to get section icon
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

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600 mt-1">View and manage your resume information</p>
          </div>
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Dynamic Sections from Resume */}
      {sections.map((section, sectionIndex) => {
        // Clean section name
        const cleanedSectionName = cleanText(section.section_name, 'section');
        
        // Skip empty sections
        if (!cleanedSectionName) return null;

        return (
          <div key={sectionIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="mr-3 text-3xl">{getSectionIcon(cleanedSectionName)}</span>
                {cleanedSectionName}
              </h2>
            </div>

            {/* Section Content */}
            <div className="p-8">
              {section.subsections && section.subsections.length > 0 ? (
                <div className="space-y-6">
                  {section.subsections.map((subsection, subIndex) => {
                    // Clean subsection title
                    const cleanedTitle = cleanText(subsection.title, 'subsection');

                    return (
                      <div key={subIndex} className="border-l-4 border-blue-500 pl-6">
                        {/* Subsection Title */}
                        {cleanedTitle && cleanedTitle.trim() !== '' && (
                          <h3 className="text-lg font-bold text-gray-800 mb-3">
                            {cleanedTitle}
                          </h3>
                        )}

                        {/* Subsection Data */}
                        {subsection.data && subsection.data.length > 0 ? (
                          <div className="space-y-2">
                            {subsection.data.map((item, dataIndex) => {
                              // Clean the text
                              const cleanedItem = cleanText(item, 'bullet');
                              
                              // Skip empty items
                              if (!cleanedItem || cleanedItem === 'NA') return null;
                              
                              return (
                                <div 
                                  key={dataIndex} 
                                  className="flex items-start gap-3 group hover:bg-blue-50 p-3 rounded-lg transition-colors"
                                >
                                  <span className="text-blue-600 mt-1 flex-shrink-0 font-bold">•</span>
                                  <div className="text-gray-700 leading-relaxed flex-1 break-words">
                                    <ContentFormatter text={cleanedItem} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No data available</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">No information available in this section</p>
              )}
            </div>
          </div>
        );
      })}

      {/* Selected Roles */}
      {profileData?.selectedRoles && profileData.selectedRoles.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-3 text-3xl">💼</span>
              Selected Roles
            </h2>
            <button
              onClick={onEditRoles}
              className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Roles
            </button>
          </div>
          <div className="p-8">
            <div className="flex flex-wrap gap-3">
              {profileData.selectedRoles.map((role, index) => (
                <span
                  key={index}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition transform hover:scale-105"
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