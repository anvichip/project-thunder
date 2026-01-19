// src/components/MyResumes.jsx - FIXED VERSION
import { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api'; // FIXED: Use named import
import ResumeTile from './ResumeTile';
import ResumePopup from './ResumePopup';

const MyResumes = ({ userData }) => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchResumeData();
  }, [userData]);

  const fetchResumeData = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      
      console.log('Fetching resume for user:', userData?.email);
      
      if (!userData?.email) {
        throw new Error('User email is required');
      }
      
      const resume = await resumeAPI.getUserResume(userData.email);
      console.log('Resume data received:', resume);
      setResumeData(resume);
    } catch (error) {
      console.error('Error fetching resume:', error);
      setError(error.message || 'Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleTileClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleCopyLink = async () => {
    if (resumeData?.sharable_link) {
      const fullUrl = `${window.location.origin}${resumeData.sharable_link}`;
      try {
        await navigator.clipboard.writeText(fullUrl);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = fullUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copied to clipboard!');
      }
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">My Resumes</h1>
          <p className="text-gray-600">Manage and share your professional resume</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="font-semibold">Error: </span>
                <span>{error}</span>
                <button 
                  onClick={fetchResumeData}
                  className="ml-4 underline hover:no-underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resume Tile */}
        {resumeData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResumeTile 
              resumeData={resumeData}
              onClick={handleTileClick}
            />
          </div>
        ) : !error ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Resume Generated Yet</h3>
            <p className="text-gray-600 mb-4">
              Complete your profile to generate your resume
            </p>
          </div>
        ) : null}

        {/* Resume Popup */}
        {showPopup && resumeData && (
          <ResumePopup 
            resumeData={resumeData}
            onClose={handleClosePopup}
            onCopyLink={handleCopyLink}
          />
        )}
      </div>
    </div>
  );
};

export default MyResumes;