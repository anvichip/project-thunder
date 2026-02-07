import React from 'react';

const OnboardingProgressBar = ({ currentStep }) => {
  const steps = [
    {
      id: 1,
      name: 'Email Verification',
      description: 'Verify your identity'
    },
    {
      id: 2,
      name: 'Profile',
      description: 'Upload resume'
    },
    {
      id: 3,
      name: 'Preferences',
      description: 'Select roles'
    },
    {
      id: 4,
      name: 'Culture',
      description: 'Set preferences'
    },
    {
      id: 5,
      name: 'Resume/CV',
      description: 'Review & confirm'
    },
    {
      id: 6,
      name: 'Done',
      description: 'All set!'
    }
  ];

  return (
    <div className="w-full bg-white border-b border-gray-200 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Circle and Label Container */}
              <div className="flex flex-col items-center" style={{ minWidth: '120px' }}>
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                    ${currentStep > step.id
                      ? 'bg-green-600 text-white'
                      : currentStep === step.id
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {currentStep > step.id ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : step.id === 6 && currentStep === 6 ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                
                {/* Step Label - Desktop */}
                <div className="hidden md:block text-center mt-3">
                  <p
                    className={`
                      text-xs font-semibold
                      ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}
                    `}
                  >
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mt-5">
                  <div
                    className={`
                      h-full transition-all duration-500
                      ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'}
                    `}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile Step Label */}
        <div className="md:hidden text-center mt-6">
          <p className="text-sm font-bold text-gray-900">{steps[currentStep - 1]?.name}</p>
          <p className="text-xs text-gray-600 mt-1">{steps[currentStep - 1]?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingProgressBar;