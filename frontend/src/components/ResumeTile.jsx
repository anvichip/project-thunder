// src/components/ResumeTile.jsx - Commercial Grade Design
import { useState } from 'react';

const ResumeTile = ({ resumeData, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const metadata = resumeData.metadata || {};
  const updatedDate = new Date(resumeData.updated_at);
  
  const handleCopyLink = async (e) => {
    e.stopPropagation();
    
    const apiUrl = import.meta.env.REACT_BASE_API_URL || 'http://localhost:8000';
    const fullUrl = `${apiUrl}${resumeData.sharable_link}`;
    
    try {
      await navigator.clipboard.writeText(fullUrl);
      // Optional: Add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl border border-gray-100"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

      {/* Main Content */}
      <div className="p-8 relative">
        {/* Icon */}
        <div className="mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <svg className="w-11 h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">
          Your Resume
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Views</span>
            </div>
            <p className="text-2xl font-bold text-indigo-900">{resumeData.view_count || 0}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Sections</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{metadata.sections_count || 0}</p>
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
        className={`absolute inset-0 bg-gradient-to-br from-indigo-600/97 via-purple-600/97 to-pink-600/97 flex flex-col items-center justify-center transition-all duration-500 ${
          isHovered ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="text-center px-8 transform transition-all duration-500" style={{ transform: isHovered ? 'translateY(0)' : 'translateY(20px)' }}>
          <div className="mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-xl border border-white/30 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-white font-bold text-lg mb-3">Share Your Resume</p>
            <div className="bg-white/20 backdrop-blur-xl rounded-xl p-4 border border-white/30">
              <p className="text-white/90 text-xs font-mono truncate">
                {import.meta.env.REACT_BASE_API_URL || 'http://localhost:8000'}{resumeData.sharable_link}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-6 py-3.5 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition-all duration-200 font-bold text-sm shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </button>
            
            <button
              onClick={onClick}
              className="flex items-center gap-2 px-6 py-3.5 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-bold text-sm backdrop-blur-xl border border-white/30 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </button>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="absolute top-6 right-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          Active
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-50 blur-2xl group-hover:opacity-70 transition-opacity duration-500"></div>
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-50 blur-2xl group-hover:opacity-70 transition-opacity duration-500"></div>
    </div>
  );
};

export default ResumeTile;