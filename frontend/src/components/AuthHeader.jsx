// src/components/AuthHeader.jsx - Professional Redesign
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthHeader = ({ userData, authMethod, onLogout, showLogout = true }) => {
  const { isAuthenticated, user } = useAuth0();
  
  const getAuthIcon = () => {
    if (authMethod === 'auth0') {
      return (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
            <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z"/>
          </svg>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    );
  };

  const getAuthLabel = () => {
    return authMethod === 'auth0' ? 'Auth0 Account' : 'Email Account';
  };

  return (
    <div className="glass sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo/Brand */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">RESLY.AI</h1>
              <p className="text-xs text-gray-500 font-medium">Profile Setup</p>
            </div>
          </div>

          {/* Right: User Info & Logout */}
          <div className="flex items-center gap-4">
            {/* Auth Info - Desktop */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg">
              {getAuthIcon()}
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">
                  {isAuthenticated && user?.name ? user.name : userData?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500">{getAuthLabel()}</p>
              </div>
            </div>

            {/* Auth Info - Mobile */}
            <div className="sm:hidden flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg">
              {getAuthIcon()}
            </div>

            {/* Logout Button */}
            {showLogout && (
              <button
                onClick={onLogout}
                className="btn btn-secondary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;