// src/components/Login.jsx - Commercial Redesign
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { authAPI } from '../services/api';

const LoginPage = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginWithRedirect } = useAuth0();

  const handleAuth0Login = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithRedirect();
    } catch (err) {
      console.error('Auth0 login error:', err);
      setError('Auth0 login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with email:', formData.email);
      const response = await authAPI.login(formData.email, formData.password);
      console.log('Login successful:', response);

      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('auth_method', 'email');

      onLogin(response.user, 'email');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
      }
      setError(err.response?.data?.detail || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 mesh-gradient-1"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-500/20 to-accent-purple/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent-cyan/20 to-accent-pink/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8 fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl animated-gradient shadow-glow">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Resume</span> Unlocked
            </h1>
            <p className="text-neutral-600 text-lg font-medium">
              Your career, reimagined.
            </p>
          </div>

          {/* Login Card */}
          <div className="card glass scale-in p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2 text-center">
              Welcome back
            </h2>
            <p className="text-neutral-600 text-center mb-6">
              Sign in to continue your journey
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 slide-in-left">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleAuth0Login}
                disabled={loading}
                className="btn btn-primary w-full py-4 text-base"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="spinner"></span>
                    Signing in...
                  </span>
                ) : (
                  'Continue with Auth0'
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-neutral-500 font-medium">or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-secondary w-full py-4 text-base"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="spinner"></span>
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t-2 border-neutral-100">
              <p className="text-center text-sm text-neutral-600">
                New to Resume Unlocked?{' '}
                <button className="font-semibold text-primary-600 hover:text-primary-700 transition">
                  Create an account
                </button>
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 text-center fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-sm text-neutral-500 mb-3">Trusted by professionals at</p>
            <div className="flex items-center justify-center gap-6 opacity-60">
              <div className="text-neutral-700 font-bold text-sm">Google</div>
              <div className="text-neutral-700 font-bold text-sm">Microsoft</div>
              <div className="text-neutral-700 font-bold text-sm">Amazon</div>
              <div className="text-neutral-700 font-bold text-sm">Meta</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;