// src/components/ResumeTile.jsx - UPDATED for consistency
import { useState } from 'react';

const ResumeTile = ({ resumeData, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const metadata = resumeData.metadata || {};
  const createdDate = new Date(resumeData.created_at);
  const updatedDate = new Date(resumeData.updated_at);
  
  const handleCopyLink = async (e) => {
    e.stopPropagation();
    
    // FIXED: Use backend URL for sharable link
    const fullUrl = `${import.meta.env.REACT_BASE_API_URL}${resumeData.sharable_link}`;
    
    try {
      await navigator.clipboard.writeText(fullUrl);
      alert('✓ Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      className="relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Content */}
      <div className="p-6">
        {/* Icon */}
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {metadata.name || 'Professional Resume'}
        </h3>

        {/* Subtitle */}
        {metadata.title && (
          <p className="text-sm text-gray-600 mb-4">{metadata.title}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{resumeData.view_count || 0} views</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>{metadata.sections_count || 0} sections</span>
          </div>
        </div>

        {/* Last Updated */}
        <p className="text-xs text-gray-400">
          Updated {updatedDate.toLocaleDateString()}
        </p>
      </div>

      {/* Hover Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-blue-600/95 to-purple-600/95 flex flex-col items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="text-center px-6">
          <div className="mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-white font-semibold mb-2">Sharable Link</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <p className="text-white/90 text-xs truncate">
                {import.meta.env.REACT_BASE_API_URL}{resumeData.sharable_link}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </button>
            
            <button
              onClick={onClick}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition font-medium text-sm backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Resume
            </button>
          </div>

          {(metadata.email || metadata.phone) && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex flex-col gap-1 text-white/80 text-xs">
                {metadata.email && (
                  <div className="flex items-center gap-2 justify-center">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{metadata.email}</span>
                  </div>
                )}
                {metadata.phone && (
                  <div className="flex items-center gap-2 justify-center">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{metadata.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
          Active
        </span>
      </div>
    </div>
  );
};

export default ResumeTile;