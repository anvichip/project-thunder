import { useState, useEffect } from 'react';

const Congratulations = ({ onGoToDashboard }) => {
  const [countdown, setCountdown] = useState(15);

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Congratulations Text */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🎉 Congratulations! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your profile has been successfully created!
          </p>

          {/* Success Message */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              What's Next?
            </h3>
            <p className="text-green-700">
              You're all set! We'll redirect you to your dashboard where you can explore opportunities, manage your profile, and track your applications.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <span className="text-3xl font-bold text-white">{countdown}</span>
            </div>
            <p className="text-gray-600">
              Redirecting to dashboard in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onGoToDashboard}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 shadow-lg transform hover:scale-105"
            >
              Go to Dashboard Now
            </button>
            
            <p className="text-sm text-gray-500">
              Or wait for automatic redirect
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-200">
            <div>
              <div className="text-3xl mb-2">📝</div>
              <p className="text-sm text-gray-600 font-medium">Profile Ready</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm text-gray-600 font-medium">Roles Selected</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🚀</div>
              <p className="text-sm text-gray-600 font-medium">Ready to Start</p>
            </div>
          </div>
        </div>

        {/* Floating Confetti Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              <div
                className="text-2xl opacity-70"
                style={{
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              >
                {['🎉', '🎊', '⭐', '✨', '🌟'][Math.floor(Math.random() * 5)]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Congratulations;