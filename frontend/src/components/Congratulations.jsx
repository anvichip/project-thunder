// src/components/Congratulations.jsx - Professional Redesign
import { useState, useEffect } from 'react';

const Congratulations = ({ onGoToDashboard }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onGoToDashboard();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onGoToDashboard]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-30 -ml-48 -mb-48"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Success Animation */}
          <div className="text-center mb-12 scale-in">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Main Card */}
          <div className="card-elevated p-12 text-center fade-in">
            {/* Title */}
            <h1 className="text-5xl font-bold mb-4">
              <span className="gradient-text">Congratulations!</span> 🎉
            </h1>
            
            <p className="text-2xl text-gray-600 mb-8">
              Your profile is ready to shine
            </p>

            {/* Success Message */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-green-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    What's Next?
                  </h3>
                  <p className="text-green-800 leading-relaxed">
                    Your professional resume is now live! Access your dashboard to explore opportunities, manage your profile, track analytics, and share your resume with recruiters.
                  </p>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 shadow-lg">
                <span className="text-3xl font-bold text-white">{countdown}</span>
              </div>
              <p className="text-lg text-gray-600 font-medium">
                Redirecting to dashboard in <span className="font-bold text-blue-600">{countdown}</span> second{countdown !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={onGoToDashboard}
                className="btn btn-primary w-full btn-lg hover-lift"
              >
                <span className="flex items-center justify-center gap-3">
                  Go to Dashboard Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <p className="text-sm text-gray-500">
                Or wait for automatic redirect
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-200">
              <div className="fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-bold text-gray-900 mb-1">Profile Ready</p>
                <p className="text-sm text-gray-600">All set and complete</p>
              </div>
              
              <div className="fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-teal-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-bold text-gray-900 mb-1">Roles Selected</p>
                <p className="text-sm text-gray-600">Tailored to your goals</p>
              </div>
              
              <div className="fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-purple-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="font-bold text-gray-900 mb-1">Ready to Start</p>
                <p className="text-sm text-gray-600">Let's unlock opportunities</p>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center mt-8 fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-gray-600">
              Welcome to <span className="font-bold gradient-text">Resume Unlocked</span> 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Congratulations;