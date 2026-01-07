// src/components/ResumeTemplateUpload.jsx - FIXED with Standard Template
import { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';

const ResumeTemplateUpload = ({ userData }) => {
  const [template, setTemplate] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [useStandardTemplate, setUseStandardTemplate] = useState(false);

  useEffect(() => {
    fetchProfileData();
    fetchSavedTemplates();
  }, []);

  const fetchProfileData = async () => {
    try {
      const profile = await resumeAPI.getProfile(userData.email);
      setProfileData(profile.profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    }
  };

  const fetchSavedTemplates = async () => {
    try {
      const templates = await resumeAPI.getSavedTemplates(userData.email);
      setSavedTemplates(templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    setTemplate(file);
    setUseStandardTemplate(false);
    setError('');
    setSuccess('');
  };

  const handleUseStandardTemplate = () => {
    setUseStandardTemplate(true);
    setTemplate(null);
    setError('');
    setSuccess('');
  };

  const handleGenerateResume = async (format = 'pdf') => {
    if (!useStandardTemplate && !template) {
      setError('Please upload a template or use the standard template');
      return;
    }

    if (!profileData) {
      setError('Profile data not found. Please complete your profile first.');
      return;
    }

    setGenerating(true);
    setError('');
    setSuccess('');

    try {
      console.log('Generating resume with format:', format);
      console.log('Using standard template:', useStandardTemplate);
      
      let blob;
      
      if (useStandardTemplate) {
        // Use standard template
        const response = await resumeAPI.generateStandardResume(userData.email, format);
        blob = new Blob([response.data], { 
          type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        });
      } else {
        // Use uploaded template
        const formData = new FormData();
        formData.append('template', template);
        formData.append('email', userData.email);
        formData.append('format', format);

        const response = await resumeAPI.generateResume(formData);
        blob = new Blob([response.data], { 
          type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        });
      }

      // Download file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume_${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(`Resume generated successfully as ${format.toUpperCase()}!`);
      
      // Refresh saved templates
      await fetchSavedTemplates();
    } catch (error) {
      console.error('Error generating resume:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      setError(error.response?.data?.detail || error.message || 'Failed to generate resume');
    } finally {
      setGenerating(false);
    }
  };

  const handlePreview = async () => {
    if (!useStandardTemplate && !template) {
      setError('Please upload a template or use the standard template');
      return;
    }

    setUploading(true);
    setError('');
    
    try {
      if (useStandardTemplate) {
        // Preview standard template
        const response = await resumeAPI.previewStandardResume(userData.email);
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        setPreviewUrl(url);
      } else {
        // Preview uploaded template
        const formData = new FormData();
        formData.append('template', template);
        formData.append('email', userData.email);

        const response = await resumeAPI.previewResume(formData);
        if (response.previewUrl) {
          setPreviewUrl(response.previewUrl);
        }
      }
    } catch (error) {
      console.error('Preview error:', error);
      setError('Failed to generate preview');
    } finally {
      setUploading(false);
    }
  };

  const handleUseTemplate = async (templateId) => {
    setGenerating(true);
    setError('');
    
    try {
      const response = await resumeAPI.generateFromSavedTemplate(
        userData.email,
        templateId,
        'pdf'
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess('Resume generated successfully!');
    } catch (error) {
      console.error('Error using template:', error);
      setError('Failed to generate resume from saved template');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Resume Template Generator</h1>
        <p className="text-gray-600">Upload a template or use our standard template to generate your resume</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload/Standard Template Section */}
        <div className="lg:col-span-2">
          {/* Standard Template Option */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Standard Template</h2>
                <p className="text-gray-600 text-sm">Use our professionally designed template</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Recommended
              </span>
            </div>
            
            <div className="bg-white rounded-lg p-6 mb-4 border-2 border-dashed border-blue-300">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-center font-semibold text-gray-800 mb-2">Professional Resume Template</h3>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• Clean and modern design</li>
                <li>• ATS-friendly format</li>
                <li>• Auto-filled with your profile data</li>
                <li>• Ready for PDF download</li>
              </ul>
            </div>

            <button
              onClick={handleUseStandardTemplate}
              disabled={generating}
              className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
                useStandardTemplate
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {useStandardTemplate ? '✓ Standard Template Selected' : 'Use Standard Template'}
            </button>
          </div>

          {/* Custom Template Upload */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Or Upload Custom Template</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              
              <label className="cursor-pointer">
                <span className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-200 inline-block font-medium">
                  Choose Template File
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleTemplateUpload}
                  className="hidden"
                />
              </label>
              
              {template && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Selected: {template.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(template.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-4">
                Supported formats: PDF, DOCX
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Generate Resume</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handlePreview}
                disabled={(!template && !useStandardTemplate) || uploading || generating}
                className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 font-medium"
              >
                {uploading ? 'Generating...' : 'Preview'}
              </button>
              
              <button
                onClick={() => handleGenerateResume('pdf')}
                disabled={(!template && !useStandardTemplate) || generating}
                className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 font-medium"
              >
                {generating ? 'Generating...' : 'Download PDF'}
              </button>
              
              <button
                onClick={() => handleGenerateResume('docx')}
                disabled={(!template && !useStandardTemplate) || generating}
                className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 font-medium"
              >
                {generating ? 'Generating...' : 'Download DOCX'}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          {previewUrl && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Preview</h2>
              <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <iframe
                  src={previewUrl}
                  className="w-full h-full"
                  title="Resume Preview"
                />
              </div>
            </div>
          )}
        </div>

        {/* Saved Templates Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Saved Templates</h2>
            
            {savedTemplates.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-sm">No saved templates yet</p>
                <p className="text-gray-400 text-xs mt-2">Templates will appear here after generation</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedTemplates.map((tmpl) => (
                  <div
                    key={tmpl.id || tmpl._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 text-sm">
                          {tmpl.name || 'Resume Template'}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(tmpl.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {tmpl.format || 'pdf'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleUseTemplate(tmpl.id || tmpl._id)}
                      disabled={generating}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-200 text-sm font-medium"
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplateUpload;