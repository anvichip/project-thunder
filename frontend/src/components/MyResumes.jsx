// src/components/MyResumes.jsx - Professional Redesign
import { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
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
      setError('');
      
      if (!userData?.email) {
        throw new Error('User email is required');
      }
      
      const resume = await resumeAPI.getUserResume(userData.email);
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
        showToast('Link copied to clipboard!', 'success');
      } catch (err) {
        showToast('Failed to copy link', 'error');
      }
    }
  };

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-8 right-8 z-50 px-6 py-4 rounded-lg shadow-xl scale-in ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    } text-white font-semibold`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-medium">Loading your resume...</p>
          <p className="text-sm text-gray-500 mt-2">This will only take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card-elevated p-8 fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
              {resumeData && (
                <span className="badge badge-success">Active</span>
              )}
            </div>
            <p className="text-gray-600">
              Manage and share your professional resume
            </p>
          </div>

          {resumeData && (
            <div className="flex gap-3">
              <button
                onClick={handleCopyLink}
                className="btn btn-secondary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
              
              <button
                onClick={handleTileClick}
                className="btn btn-primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Resume
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card p-6 border-l-4 border-red-500">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-900 mb-1">Error Loading Resume</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button 
                onClick={fetchResumeData}
                className="btn btn-secondary text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
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
      ) : !error && (
        <div className="card-elevated p-16 text-center scale-in">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-8 rounded-xl bg-gray-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Resume Generated Yet</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Complete your profile to generate your professional resume and start sharing it with employers.
            </p>
            <button className="btn btn-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Resume
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {resumeData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="stats-card hover-lift">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{resumeData.view_count || 0}</p>
              </div>
            </div>
          </div>

          <div className="stats-card hover-lift">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Last Updated</p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(resumeData.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card hover-lift">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Sections</p>
                <p className="text-3xl font-bold text-gray-900">{resumeData.metadata?.sections_count || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Popup */}
      {showPopup && resumeData && (
        <ResumePopup 
          resumeData={resumeData}
          userData={userData}
          onClose={handleClosePopup}
          onCopyLink={handleCopyLink}
        />
      )}
    </div>
  );
};

export default MyResumes;