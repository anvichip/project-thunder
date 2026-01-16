import React from 'react';

const AnalyticsView = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-2xl">📊</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
        <p className="text-gray-600">View your profile analytics and insights</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
        <div className="text-4xl mb-3">👁️</div>
        <p className="text-sm text-gray-600 mb-1">Profile Views</p>
        <p className="text-3xl font-bold text-gray-800">0</p>
      </div>
      
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
        <div className="text-4xl mb-3">📄</div>
        <p className="text-sm text-gray-600 mb-1">Resumes Created</p>
        <p className="text-3xl font-bold text-gray-800">0</p>
      </div>
      
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
        <div className="text-4xl mb-3">🎯</div>
        <p className="text-sm text-gray-600 mb-1">Applications</p>
        <p className="text-3xl font-bold text-gray-800">0</p>
      </div>
    </div>
  </div>
);

export default AnalyticsView;