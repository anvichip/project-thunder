// src/components/ResumeUpload.jsx - FIXED to pass userId correctly
import { useState } from 'react';
import { resumeAPI } from '../services/api';
import AuthHeader from './AuthHeader';

const ResumeUpload = ({ userData, authMethod, onNext, onLogout }) => {
  const [parsedSections, setParsedSections] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
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

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    // Validate userData and email
    if (!userData || !userData.email) {
      setError('User email is required. Please log in again.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      console.log('Uploading resume:', file.name);
      console.log('User data:', userData);
      console.log('User email:', userData.email);
      
      // FIXED: Pass email correctly as userId
      const response = await resumeAPI.uploadResume(file, userData.email);
      
      console.log('Upload response:', response);
      
      if (!response.extractedData) {
        throw new Error('No extracted data received from server');
      }

      if (!response.extractedData.sections || !Array.isArray(response.extractedData.sections)) {
        throw new Error('Invalid resume data structure received');
      }

      // Validate sections structure
      const validatedSections = response.extractedData.sections.map(section => {
        if (!section.section_name) {
          throw new Error('Section missing section_name');
        }
        if (!Array.isArray(section.subsections)) {
          throw new Error('Section missing subsections array');
        }
        return {
          section_name: section.section_name,
          subsections: section.subsections.map(subsection => ({
            title: subsection.title || '',
            data: Array.isArray(subsection.data) ? subsection.data : []
          }))
        };
      });

      setParsedSections(validatedSections);
      setUploading(false);
      alert('Resume uploaded and parsed successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to upload resume. Please try again.');
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
    } else {
      alert('Cannot remove the last item. Each subsection must have at least one data item.');
    }
  };

  const handleSubmit = () => {
    if (parsedSections.length === 0) {
      setError('Please upload and parse a resume first');
      return;
    }
    
    console.log('Submitting parsed sections:', { sections: parsedSections });
    
    // Pass the entire parsed structure with email
    onNext({ 
      sections: parsedSections,
      email: userData?.email 
    });
  };

  const renderDynamicSections = () => {
    if (parsedSections.length === 0) return null;

    return (
      <div className="space-y-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Review & Edit Parsed Information</h2>
          <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
            {parsedSections.length} sections found
          </span>
        </div>
        
        {parsedSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              <span className="mr-2">📋</span>
              {section.section_name}
              <span className="ml-auto text-sm font-normal text-gray-600">
                {section.subsections?.length || 0} subsection(s)
              </span>
            </h3>

            {section.subsections && section.subsections.map((subsection, subsectionIndex) => (
              <div key={subsectionIndex} className="bg-white rounded-xl p-5 mb-4 border border-gray-200">
                {/* Subsection Title */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subsection Title
                  </label>
                  <input
                    type="text"
                    value={subsection.title || ''}
                    onChange={(e) => handleSubsectionTitleChange(sectionIndex, subsectionIndex, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter subsection title"
                  />
                </div>

                {/* Subsection Data Items */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Details ({subsection.data?.length || 0} items)
                  </label>
                  {subsection.data && subsection.data.map((dataItem, dataIndex) => (
                    <div key={dataIndex} className="flex items-start gap-2">
                      <textarea
                        value={dataItem}
                        onChange={(e) => handleSectionChange(sectionIndex, subsectionIndex, dataIndex, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        rows="2"
                        placeholder="Enter detail"
                      />
                      <button
                        onClick={() => removeDataItem(sectionIndex, subsectionIndex, dataIndex)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        title="Remove"
                        disabled={subsection.data.length === 1}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => addDataItem(sectionIndex, subsectionIndex)}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                  >
                    + Add Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium text-lg shadow-lg"
        >
          Continue to Role Selection →
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <AuthHeader userData={userData} authMethod={authMethod} onLogout={onLogout} />
      
      <div className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Your Resume</h2>
            <p className="text-gray-600 mb-6">
              Upload your resume and we'll extract all sections automatically
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Upload Section */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-300">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <div className="text-center mb-4">
                <label className="cursor-pointer">
                  <span className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 inline-block font-medium">
                    Choose Resume File
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                
                {file && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 font-medium">Selected: {file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleFileUpload}
                disabled={!file || uploading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 font-medium"
              >
                {uploading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Parsing Resume...
                  </span>
                ) : 'Upload & Parse Resume'}
              </button>
              
              <p className="text-sm text-gray-500 mt-4 text-center">
                Supported formats: PDF, DOCX • Max size: 10MB
              </p>
            </div>

            {/* Dynamic Sections */}
            {renderDynamicSections()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;