import { useState } from 'react';

const VerificationPage = ({ extractedData, onConfirm, onBack }) => {
  const [formData, setFormData] = useState(extractedData);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Invalid email format';
    }
    
    if (name === 'phone' && value && !/^\+?[\d\s-()]+$/.test(value)) {
      error = 'Invalid phone format';
    }
    
    if ((name === 'linkedin' || name === 'github') && value && !/^https?:\/\/.+/.test(value)) {
      error = 'URL must start with http:// or https://';
    }

    return error;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    const error = validateField(field, value);
    setErrors({ ...errors, [field]: error });
  };

  const handleSubmit = () => {
    const newErrors = {};
    let hasErrors = false;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    if (!formData.fullName || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    onConfirm(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Information</h2>
              <p className="text-gray-600">
                Please review and correct any information that was extracted incorrectly
              </p>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-200"
            >
              ← Back
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Review Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Check all fields carefully. Automated parsing may have errors.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {/* Personal Information Section */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => {
                      let value = e.target.value.trim();

                      if (value && !/^https?:\/\//i.test(value)) {
                        value = `https://${value}`;
                      }
                      handleChange('linkedin', value);
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${
                      errors.linkedin ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.linkedin && <p className="text-red-500 text-xs mt-1">{errors.linkedin}</p>}
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
                Professional Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => {
                      let value = e.target.value.trim();

                      if (value && !/^https?:\/\//i.test(value)) {
                        value = `https://${value}`;
                      }
                      handleChange('github', value);
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${
                      errors.github ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.github && <p className="text-red-500 text-xs mt-1">{errors.github}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills
                  </label>
                  <textarea
                    value={formData.skills}
                    onChange={(e) => handleChange('skills', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Experience
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education
                  </label>
                  <textarea
                    value={formData.education}
                    onChange={(e) => handleChange('education', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={onBack}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
              >
                Go Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
              >
                Confirm & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;