// src/components/JDMatcher.jsx - COMPLETE VERSION
import { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';

const JDMatcher = ({ userData }) => {
  const [step, setStep] = useState('upload'); // 'upload', 'processing', or 'results'
  const [jobDescription, setJobDescription] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [jdFileUrl, setJdFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Results data
  const [matchResults, setMatchResults] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError('Only PDF files are supported');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      
      setJdFile(file);
      setJdFileUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleEnhance = async () => {
    if (!jobDescription && !jdFile) {
      setError('Please provide either a job description text or upload a PDF');
      return;
    }

    if (!userData?.email) {
      setError('User email not found. Please log in again.');
      return;
    }

    setLoading(true);
    setError('');
    setStep('processing');

    try {
      const result = await profileAPI.matchJD(
        userData.email,
        jobDescription,
        jdFile
      );

      setMatchResults(result);
      setStep('results');
      console.log('Match results:', result);
      
    } catch (err) {
      console.error('JD matching error:', err);
      setError(err.message || 'Failed to process job description. Please try again.');
      setStep('upload');
    } finally {
      setLoading(false);
    }
  };

  const resetMatcher = () => {
    setStep('upload');
    setJobDescription('');
    setJdFile(null);
    setJdFileUrl(null);
    setMatchResults(null);
    setError('');
  };

  // Clean up file URL on unmount
  useEffect(() => {
    return () => {
      if (jdFileUrl) {
        URL.revokeObjectURL(jdFileUrl);
      }
    };
  }, [jdFileUrl]);

  // Upload Step
  if (step === 'upload') {
    return (
      <div className="card-elevated p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">JD Matcher</h3>
          <p className="text-gray-600 text-center">
            Upload or paste a job description to see how your resume matches
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {/* JD Text Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Paste Job Description
            </label>
            <textarea 
              className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
              placeholder="Paste the full job requirements here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <p className="mt-1 text-sm text-gray-500">
              {jobDescription.length} characters
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 font-medium">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Job Description (PDF)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-500 transition-colors">
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileUpload} 
                className="hidden" 
                id="jd-upload" 
              />
              <label htmlFor="jd-upload" className="cursor-pointer">
                {jdFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <div className="text-teal-600 font-medium">{jdFile.name}</div>
                      <div className="text-sm text-gray-500">{(jdFile.size / 1024).toFixed(2)} KB</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="text-teal-600 font-medium mb-1">Click to upload PDF</div>
                    <div className="text-sm text-gray-500">or drag and drop</div>
                  </div>
                )}
              </label>
            </div>
          </div>

          <button 
            onClick={handleEnhance}
            disabled={loading || (!jobDescription && !jdFile)}
            className={`w-full py-3 rounded-xl font-bold transition-colors ${
              loading || (!jobDescription && !jdFile)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Analyze Match'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Processing Step
  if (step === 'processing') {
    return (
      <div className="card-elevated p-12 max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <svg className="animate-spin h-16 w-16 mx-auto text-teal-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Job Description</h3>
        <p className="text-gray-600">
          Our AI is extracting skills and comparing them with your resume...
        </p>
        <div className="mt-6 space-y-2">
          <div className="text-sm text-gray-500">✓ Extracting skills from JD</div>
          <div className="text-sm text-gray-500">✓ Analyzing your resume</div>
          <div className="text-sm text-gray-500">⌛ Generating recommendations</div>
        </div>
      </div>
    );
  }

  // Results Step
  if (step === 'results' && matchResults) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header with Score */}
        <div className="card-elevated p-6 bg-gradient-to-r from-teal-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Match Score</h2>
              <p className="text-teal-100">Your resume matches this job description</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold">{matchResults.match_percentage}%</div>
              <div className="text-sm text-teal-100 mt-2">
                {matchResults.matched_count} of {matchResults.total_jd_skills} skills matched
              </div>
            </div>
          </div>
        </div>

        {/* Split Screen View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Job Description */}
          <div className="border rounded-xl bg-white flex flex-col shadow-sm">
            <div className="p-4 border-b font-bold bg-gray-50 flex items-center justify-between">
              <span>Job Description</span>
              {jdFile && (
                <span className="text-sm font-normal text-gray-500">{jdFile.name}</span>
              )}
            </div>
            <div className="p-6 overflow-y-auto max-h-96 whitespace-pre-wrap text-gray-700 text-sm">
              {matchResults.jd_text || jobDescription}
            </div>
          </div>

          {/* Right: Skills Comparison */}
          <div className="border rounded-xl bg-white flex flex-col shadow-sm">
            <div className="p-4 border-b font-bold bg-gray-50">Skills Analysis</div>
            <div className="p-6 overflow-y-auto max-h-96 space-y-4">
              {/* Matched Skills */}
              <div>
                <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Matched Skills ({matchResults.matched_skills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchResults.matched_skills.slice(0, 20).map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Missing Skills ({matchResults.missing_skills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchResults.missing_skills.slice(0, 20).map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Box */}
        {matchResults.recommendations && (
          <div className="card-elevated p-6 border-t-4 border-teal-500 bg-white shadow-sm">
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="p-2 bg-teal-100 rounded-lg text-teal-600">✨</span>
              Tailored Recommendations
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              {/* Missing Keywords */}
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <p className="font-bold text-red-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Missing Keywords
                </p>
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  {matchResults.recommendations.missing_keywords.map((keyword, idx) => (
                    <li key={idx}>{keyword}</li>
                  ))}
                </ul>
              </div>

              {/* Matching Strengths */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="font-bold text-green-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Your Strengths
                </p>
                <ul className="list-disc list-inside space-y-1 text-green-800">
                  {matchResults.recommendations.matching_strengths.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>

              {/* Suggested Actions */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  Suggested Actions
                </p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  {matchResults.recommendations.suggested_actions.map((action, idx) => (
                    <li key={idx}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button 
            onClick={resetMatcher}
            className="px-6 py-3 text-teal-600 font-medium hover:bg-teal-50 rounded-xl transition-colors border border-teal-600"
          >
            ← Go Back
          </button>
          
        </div>
      </div>
    );
  }

  return null;
};

export default JDMatcher;