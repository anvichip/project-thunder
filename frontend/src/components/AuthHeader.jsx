// src/components/AuthHeader.jsx - Updated for Auth0
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthHeader = ({ userData, authMethod, onLogout, showLogout = true }) => {
  const { isAuthenticated, user} = useAuth0();
  const getAuthIcon = () => {
    if (authMethod === 'auth0') {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#EB5424"/>
          <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="#EB5424"/>
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  };

  const getAuthLabel = () => {
    return authMethod === 'auth0' ? 'Auth0 Account' : 'Email Account';
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Resume Unlocked</h1>
              <p className="text-xs text-gray-500">Profile Setup</p>
            </div>
          </div>

          {/* Right: User Info & Logout */}
          <div className="flex items-center gap-4">
            {/* Auth Info */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-center">
                {getAuthIcon()}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">
                  {isAuthenticated && (
                    <li>
                      <p> {user.name} </p>
                    </li>
                  )}
                </p>
                <p className="text-xs text-gray-500">{getAuthLabel()}</p>
              </div>
            </div>

            {/* Mobile Auth Info */}
            <div className="sm:hidden flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              {getAuthIcon()}
            </div>

            {/* Logout Button */}
            {showLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 font-medium text-sm"
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