// src/components/ResumePopup.jsx - FINAL FIXED VERSION
import { useState, useEffect } from 'react';

const ResumePopup = ({ resumeData, onClose, onCopyLink }) => {
  const [resumeHtml, setResumeHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Get API URL with fallback
  const getApiUrl = () => {
    const apiUrl = import.meta.env.REACT_BASE_API_URL || 'http://localhost:8000';
    console.log('API URL:', apiUrl);
    return apiUrl;
  };

  useEffect(() => {
    fetchResumeHtml();
  }, [resumeData]);

  const fetchResumeHtml = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('📖 Fetching resume HTML for ID:', resumeData.resume_id);
      
      const apiUrl = getApiUrl();
      const fetchUrl = `${apiUrl}/resume/${resumeData.resume_id}`;
      console.log('Fetching from:', fetchUrl);
      
      const response = await fetch(fetchUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to load resume: ${response.status} ${response.statusText}`);
      }
      
      const html = await response.text();
      console.log('✅ Resume HTML loaded, length:', html.length);
      
      setResumeHtml(html);
    } catch (error) {
      console.error('❌ Error fetching resume HTML:', error);
      setError(error.message || 'Failed to load resume preview');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleOpenInNewTab = () => {
    const apiUrl = getApiUrl();
    const fullUrl = `${apiUrl}${resumeData.sharable_link}`;
    console.log('Opening in new tab:', fullUrl);
    window.open(fullUrl, '_blank');
  };

  const handleCopyLink = async () => {
    const apiUrl = getApiUrl();
    const fullUrl = `${apiUrl}${resumeData.sharable_link}`;
    
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err2) {
        console.error('Fallback copy failed:', err2);
      }
      document.body.removeChild(textArea);
    }
  };

  const metadata = resumeData.metadata || {};
  const apiUrl = getApiUrl();
  const sharableUrl = `${apiUrl}${resumeData.sharable_link}`;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {metadata.name || 'Your Resume'}
              </h2>
              {metadata.title && (
                <p className="text-sm text-white/80">{metadata.title}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition backdrop-blur-sm"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sharable Link Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-200 px-6 py-5 flex-shrink-0">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <p className="text-sm font-bold text-gray-800">
                📤 Sharable Link - Share this with recruiters and employers
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-4 py-3 border-2 border-blue-300 shadow-sm">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <input
                  type="text"
                  readOnly
                  value={sharableUrl}
                  className="flex-1 text-sm text-gray-700 bg-transparent outline-none font-mono"
                  onClick={(e) => e.target.select()}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition font-medium text-sm shadow-md ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleOpenInNewTab}
                  className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="hidden sm:inline">Open in New Tab</span>
                  <span className="sm:hidden">Open</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span><strong className="text-green-700">{resumeData.view_count || 0}</strong> total views</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Updated <strong>{new Date(resumeData.updated_at).toLocaleDateString()}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading resume preview...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview Unavailable</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="space-y-2">
                  <button
                    onClick={fetchResumeHtml}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Retry
                  </button>
                  <p className="text-xs text-gray-500">
                    Make sure backend is running at: {apiUrl}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
              {/* Use srcdoc to embed HTML directly, no iframe src */}
              <iframe
                srcDoc={resumeHtml}
                className="w-full border-none"
                style={{ minHeight: '600px', height: '70vh' }}
                title="Resume Preview"
                sandbox="allow-same-origin allow-popups"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>💡 Anyone with this link can view your resume</span>
          </div>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumePopup;