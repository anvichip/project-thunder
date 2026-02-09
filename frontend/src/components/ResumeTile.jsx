// src/components/ResumeTile.jsx - Professional Redesign
import { useState } from 'react';

const ResumeTile = ({ resumeData, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const metadata = resumeData.metadata || {};
  const updatedDate = new Date(resumeData.updated_at);
  
  const handleCopyLink = async (e) => {
    e.stopPropagation();
    
    const apiUrl = process.env.REACT_APP_BASE_API_URL || 'http://localhost:8000';
    const fullUrl = `${apiUrl}${resumeData.sharable_link}`;
    
    try {
      await navigator.clipboard.writeText(fullUrl);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-200 hover:border-blue-300"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Content */}
      <div className="p-6 relative">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Your Resume
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-xs font-semibold text-blue-600 uppercase">Views</span>
            </div>
            <p className="text-xl font-bold text-blue-900">{resumeData.view_count || 0}</p>
          </div>
          
          <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-semibold text-teal-600 uppercase">Sections</span>
            </div>
            <p className="text-xl font-bold text-teal-900">{metadata.sections_count || 0}</p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Updated {updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Hover Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-blue-600 to-teal-600 flex flex-col items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="text-center px-8 transform transition-all duration-300" style={{ transform: isHovered ? 'translateY(0)' : 'translateY(20px)' }}>
          <div className="mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-white font-bold text-base mb-3">Share Your Resume</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
              <p className="text-white/90 text-xs font-mono truncate">
                {process.env.REACT_APP_BASE_API_URL || 'http://localhost:8000'}{resumeData.sharable_link}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-all font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </button>
            
            <button
              onClick={onClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all font-bold text-sm backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="hidden sm:inline">View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-full text-xs font-bold shadow-md">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          Active
        </div>
      </div>
    </div>
  );
};

export default ResumeTile;