// src/components/Congratulations.jsx - Commercial Redesign
import { useState, useEffect } from 'react';

const Congratulations = ({ onGoToDashboard }) => {
  const [countdown, setCountdown] = useState(15);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Generate confetti particles
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      emoji: ['🎉', '🎊', '⭐', '✨', '🌟', '💫', '🎈'][Math.floor(Math.random() * 7)]
    }));
    setConfetti(particles);

    // Countdown timer
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
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 mesh-gradient-2"></div>
      
      {/* Floating Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-3xl opacity-0 animate-float"
            style={{
              left: `${particle.x}%`,
              top: '-10%',
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          {/* Success Animation */}
          <div className="text-center mb-12 bounce-in">
            <div className="inline-flex items-center justify-center w-32 h-32 mb-8 rounded-3xl animated-gradient shadow-2xl">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Main Card */}
          <div className="card card-glow p-12 text-center scale-in">
            {/* Title */}
            <h1 className="text-5xl font-bold mb-4">
              <span className="gradient-text">Congratulations!</span> 🎉
            </h1>
            
            <p className="text-2xl text-neutral-600 mb-8">
              Your profile is ready to shine
            </p>

            {/* Success Message */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    What's Next?
                  </h3>
                  <p className="text-green-800 leading-relaxed">
                    Your professional resume is now live! Access your dashboard to explore opportunities, manage your profile, track applications, and share your resume with recruiters.
                  </p>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 mb-4 rounded-2xl animated-gradient shadow-glow">
                <span className="text-4xl font-bold text-white">{countdown}</span>
              </div>
              <p className="text-lg text-neutral-600 font-medium">
                Redirecting to dashboard in <span className="font-bold text-primary-600">{countdown}</span> second{countdown !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={onGoToDashboard}
                className="btn btn-primary w-full py-5 text-lg hover-lift shadow-xl"
              >
                <span className="flex items-center justify-center gap-3">
                  Go to Dashboard Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <p className="text-sm text-neutral-500">
                Or wait for automatic redirect
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t-2 border-neutral-100">
              <div className="fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-3xl">📝</span>
                </div>
                <p className="font-bold text-neutral-900 mb-1">Profile Ready</p>
                <p className="text-sm text-neutral-600">All set and complete</p>
              </div>
              
              <div className="fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-3xl">🎯</span>
                </div>
                <p className="font-bold text-neutral-900 mb-1">Roles Selected</p>
                <p className="text-sm text-neutral-600">Tailored to your goals</p>
              </div>
              
              <div className="fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <span className="text-3xl">🚀</span>
                </div>
                <p className="font-bold text-neutral-900 mb-1">Ready to Start</p>
                <p className="text-sm text-neutral-600">Let's unlock opportunities</p>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center mt-8 fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-neutral-600">
              Welcome to <span className="font-bold gradient-text">Resume Unlocked</span> 
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) rotate(360deg);
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