// src/components/MyResumes.jsx - UPDATED VERSION
import { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import ResumeTile from './ResumeTile';
import ResumePopup from './ResumePopup';

const JDMatcher = ({ userData }) => {
return (
          <div className="card-elevated p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-teal-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">JD Matcher Coming Soon</h3>
              <p className="text-gray-600 mb-6">Match your resume against job descriptions and get tailored recommendations</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                In Development
              </div>
            </div>
          </div>
        );
};

export default JDMatcher;