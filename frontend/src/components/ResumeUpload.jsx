// src/components/ResumeUpload.jsx - Updated with progress bar
import { useState } from 'react';
import { resumeAPI } from '../services/api';
import AuthHeader from './AuthHeader';
import OnboardingProgressBar from './Onboardingprogressbar';

const ResumeUpload = ({ userData, authMethod, onNext, onLogout }) => {
  const [parsedSections, setParsedSections] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile && (selectedFile.type === 'application/pdf' || 
        selectedFile.name.endsWith('.docx') || selectedFile.name.endsWith('.doc'))) {
      setFile(selectedFile);
      setError('');
      setParsedSections([]);
    } else {
      setError('Please upload a PDF or DOCX file');
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!userData || !userData.email) {
      setError('User email is required. Please log in again.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await resumeAPI.uploadResume(file, userData.email);
      
      if (!response.extractedData || !response.extractedData.sections) {
        throw new Error('Invalid resume data received');
      }

      const validatedSections = response.extractedData.sections.map(section => ({
        section_name: section.section_name,
        subsections: section.subsections.map(subsection => ({
          title: subsection.title || '',
          data: Array.isArray(subsection.data) ? subsection.data : []
        }))
      }));

      setParsedSections(validatedSections);
      setUploading(false);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to upload resume');
      setUploading(false);
      setParsedSections([]);
    }
  };

  const handleSectionChange = (sectionIndex, subsectionIndex, dataIndex, value) => {
    const updatedSections = [...parsedSections];
    updatedSections[sectionIndex].subsections[subsectionIndex].data[dataIndex] = value;
    setParsedSections(updatedSections);
  };

  const handleSubsectionTitleChange = (sectionIndex, subsectionIndex, value) => {
    const updatedSections = [...parsedSections];
    updatedSections[sectionIndex].subsections[subsectionIndex].title = value;
    setParsedSections(updatedSections);
  };

  const addDataItem = (sectionIndex, subsectionIndex) => {
    const updatedSections = [...parsedSections];
    updatedSections[sectionIndex].subsections[subsectionIndex].data.push('');
    setParsedSections(updatedSections);
  };

  const removeDataItem = (sectionIndex, subsectionIndex, dataIndex) => {
    const updatedSections = [...parsedSections];
    if (updatedSections[sectionIndex].subsections[subsectionIndex].data.length > 1) {
      updatedSections[sectionIndex].subsections[subsectionIndex].data.splice(dataIndex, 1);
      setParsedSections(updatedSections);
    }
  };

  const handleSubmit = () => {
    if (parsedSections.length === 0) {
      setError('Please upload and parse a resume first');
      return;
    }
    
    onNext({ 
      sections: parsedSections,
      email: userData?.email 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader userData={userData} authMethod={authMethod} onLogout={onLogout} />
      
      {/* Progress Bar */}
      <OnboardingProgressBar currentStep={2} />
      
      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Your Resume</h1>
            <p className="text-lg text-gray-600">
              We'll automatically extract and organize your information using AI
            </p>
          </div>

          {/* Upload Section */}
          <div className="card-elevated mb-8 scale-in">
            {error && (
              <div className="p-6 border-b border-gray-200">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-red-800">{error}</span>
                </div>
              </div>
            )}

            <div className="p-8">
              {/* Drag & Drop Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-12 text-center transition-all
                  ${dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                  }
                `}
              >
                <div className="max-w-md mx-auto">
                  <div className={`
                    w-20 h-20 mx-auto mb-6 rounded-xl flex items-center justify-center transition-all
                    ${dragActive 
                      ? 'bg-blue-600 scale-110' 
                      : 'bg-gray-100'
                    }
                  `}>
                    <svg className={`w-10 h-10 ${dragActive ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {dragActive ? 'Drop your file here' : 'Upload your resume'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Drag and drop or click to browse
                  </p>
                  
                  <label className="btn btn-primary cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Choose File
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    Supported formats: PDF, DOCX • Maximum size: 10MB
                  </p>
                </div>

                {file && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-4 max-w-md mx-auto">
                    <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                      <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="btn-ghost btn-icon text-gray-500 hover:text-red-600"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleFileUpload}
                disabled={!file || uploading}
                className="btn btn-primary w-full mt-6 btn-lg"
              >
                {uploading ? (
                  <span className="flex items-center gap-3">
                    <span className="spinner"></span>
                    Analyzing your resume...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Parse Resume
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Parsed Sections */}
          {parsedSections.length > 0 && (
            <div className="space-y-6 fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Review & Edit Your Information</h2>
                  <p className="text-gray-600 mt-1">{parsedSections.length} sections extracted successfully</p>
                </div>
                <span className="badge badge-success text-sm px-4 py-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Parsed Successfully
                </span>
              </div>

              {parsedSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="card-elevated hover-lift stagger-item">
                  <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <span className="text-2xl">📋</span>
                      {section.section_name}
                      <span className="ml-auto text-sm font-normal text-blue-100">
                        {section.subsections?.length || 0} subsection(s)
                      </span>
                    </h3>
                  </div>

                  <div className="p-6 space-y-6">
                    {section.subsections?.map((subsection, subsectionIndex) => (
                      <div key={subsectionIndex} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Subsection Title
                          </label>
                          <input
                            type="text"
                            value={subsection.title || ''}
                            onChange={(e) => handleSubsectionTitleChange(sectionIndex, subsectionIndex, e.target.value)}
                            className="input"
                            placeholder="Enter title..."
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Details ({subsection.data?.length || 0} items)
                          </label>
                          {subsection.data?.map((dataItem, dataIndex) => (
                            <div key={dataIndex} className="flex items-start gap-3">
                              <textarea
                                value={dataItem}
                                onChange={(e) => handleSectionChange(sectionIndex, subsectionIndex, dataIndex, e.target.value)}
                                className="input flex-1"
                                rows="2"
                                placeholder="Enter detail..."
                              />
                              <button
                                onClick={() => removeDataItem(sectionIndex, subsectionIndex, dataIndex)}
                                disabled={subsection.data.length === 1}
                                className="btn-ghost btn-icon text-red-600 hover:bg-red-50 disabled:opacity-30"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          
                          <button
                            onClick={() => addDataItem(sectionIndex, subsectionIndex)}
                            className="btn btn-secondary text-sm"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Detail
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmit}
                className="btn btn-primary w-full btn-lg hover-lift"
              >
                <span className="flex items-center gap-3">
                  Continue to Role Selection
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;