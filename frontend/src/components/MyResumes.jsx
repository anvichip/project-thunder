// src/components/MyResumes.jsx
import { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import ResumeDetailsModal from './ResumeDetailsModal';

const MyResumes = ({ userData }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'recent', 'shared'

  useEffect(() => {
    fetchResumes();
  }, [userData]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await resumeAPI.getLatexTemplates(userData.email);
      setResumes(data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeClick = async (resume) => {
    try {
      const details = await resumeAPI.getResumeDetails(resume.id, userData.email);
      setSelectedResume(details);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching resume details:', error);
      alert('Failed to load resume details');
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      await resumeAPI.deleteResume(resumeId, userData.email);
      setResumes(resumes.filter(r => r.id !== resumeId));
      if (selectedResume?.id === resumeId) {
        setShowDetailsModal(false);
        setSelectedResume(null);
      }
      alert('Resume deleted successfully');
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume');
    }
  };

  const filteredResumes = resumes.filter(resume => {
    if (filter === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(resume.createdAt) > oneWeekAgo;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your resumes...</p>
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
          <p className="text-gray-600">Manage and share your created resumes</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Resumes ({resumes.length})
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === 'recent'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Recent
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Resumes</p>
                <p className="text-3xl font-bold text-gray-800">{resumes.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Created This Week</p>
                <p className="text-3xl font-bold text-gray-800">
                  {resumes.filter(r => {
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    return new Date(r.createdAt) > oneWeekAgo;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                <p className="text-sm font-medium text-gray-800">
                  {resumes.length > 0 
                    ? new Date(resumes[0].updatedAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🕒</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Grid */}
        {filteredResumes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="mb-6">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Resumes Yet</h3>
            <p className="text-gray-600 mb-6">
              Start creating your first resume using our templates or editor
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Create from Template
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onClick={() => handleResumeClick(resume)}
                onDelete={() => handleDeleteResume(resume.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Resume Details Modal */}
      {showDetailsModal && selectedResume && (
        <ResumeDetailsModal
          resume={selectedResume}
          userData={userData}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedResume(null);
          }}
          onRefresh={fetchResumes}
        />
      )}
    </div>
  );
};

// Resume Card Component
const ResumeCard = ({ resume, onClick, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group cursor-pointer">
      <div onClick={onClick} className="p-6">
        {/* Preview Thumbnail */}
        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
          {resume.pdfUrl ? (
            <iframe
              src={resume.pdfUrl}
              className="w-full h-full pointer-events-none"
              title={resume.name}
            />
          ) : (
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-500">No preview</p>
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-semibold">
              View Details
            </span>
          </div>
        </div>

        {/* Resume Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
            {resume.name}
          </h3>
          <p className="text-sm text-gray-500">
            Created: {new Date(resume.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Updated: {new Date(resume.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="text-blue-600 hover:text-blue-700 transition text-sm font-medium"
          >
            View
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(resume.pdfUrl, '_blank');
            }}
            className="text-green-600 hover:text-green-700 transition text-sm font-medium"
            disabled={!resume.pdfUrl}
          >
            Download
          </button>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  📄 View Details
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onDelete();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                >
                  🗑️ Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyResumes;