// src/components/MyResumes.jsx - UPDATED VERSION
import { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import ResumeTile from './ResumeTile';
import ResumePopup from './ResumePopup';

// const JDMatcher = ({ userData }) => {
// return (
//           <div className="card-elevated p-12 text-center">
//             <div className="max-w-md mx-auto">
//               <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-teal-100 flex items-center justify-center">
//                 <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//                 </svg>
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">JD Matcher Coming Soon</h3>
//               <p className="text-gray-600 mb-6">Match your resume against job descriptions and get tailored recommendations</p>
//               <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//                 </svg>
//                 In Development
//               </div>
//             </div>
//           </div>
//         );
// };

// export default JDMatcher;

// import React, { useState } from 'react';

const JDMatcher = () => {
  const [step, setStep] = useState('upload'); // 'upload' or 'results'
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      setResumeUrl(URL.createObjectURL(file));
    }
  };

  const handleEnhance = async () => {
    if (jobDescription && resumeFile) {
      const formData = new FormData();
      formData.append('file', resumeFile); // Python expects 'file'
      formData.append('jd_text', jobDescription); // Python expects 'jd_text'

      try {
        // Direct call to Python FastAPI/Flask
        const response = await fetch('http://localhost:8000/process-jd', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        console.log("Suggestions from Python:", data);
        setStep('results');
      } catch (error) {
        console.error("Connection to Python backend failed:", error);
      }
    }
  };

  // const handleEnhance = async () => {
  //   if (jobDescription && resumeFile) {
  //     const formData = new FormData();
  //     formData.append('resume', resumeFile);
  //     formData.append('jd', jobDescription);

  //     try {
  //       const response = await fetch('/api/match-jd', {
  //         method: 'POST',
  //         body: formData,
  //       });
  //       const data = await response.json();
  //       // Set your suggestions state here based on 'data'
  //       setStep('results');
  //     } catch (error) {
  //       console.error("Error matching JD:", error);
  //     }
  //   }
  // };

  // const handleEnhance = () => {
  //   if (jobDescription && resumeFile) {
  //     setStep('results');
  //   } else {
  //     alert("Please provide both a JD and a resume.");
  //   }
  // };

  if (step === 'upload') {
    return (
      <div className="card-elevated p-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">JD Matcher</h3>
        
        <div className="space-y-6">
          {/* JD Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Paste Job Description</label>
            <textarea 
              className="w-full h-48 p-4 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Paste the full job requirements here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-500 transition-colors">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileUpload} 
              className="hidden" 
              id="resume-upload" 
            />
            <label htmlFor="jd-upload" className="cursor-pointer">
              <div className="text-teal-600 font-medium">{resumeFile ? resumeFile.name : "Click to upload Job Description (PDF)"}</div>
            </label>
          </div>

          <button 
            onClick={handleEnhance}
            className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors"
          >
            Enhance Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Split Screen View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
        {/* Left: Job Description */}
        <div className="border rounded-xl bg-white flex flex-col">
          <div className="p-4 border-b font-bold bg-gray-50">Job Description</div>
          <div className="p-6 overflow-y-auto whitespace-pre-wrap text-gray-700">
            {jobDescription}
          </div>
        </div>

        {/* Right: PDF Preview */}
        <div className="border rounded-xl bg-white flex flex-col overflow-hidden">
          <div className="p-4 border-b font-bold bg-gray-50">Uploaded Resume</div>
          <iframe 
            src={resumeUrl} 
            className="w-full h-full" 
            title="Resume Preview"
          />
        </div>
      </div>

      {/* Suggestions Box */}
      <div className="card-elevated p-6 border-t-4 border-teal-500 bg-white">
        <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="p-2 bg-teal-100 rounded-lg text-teal-600">✨</span>
          Tailored Recommendations
        </h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-red-50 rounded-lg border border-red-100 text-red-800">
            <p className="font-bold">Missing Keywords</p>
            <ul className="list-disc list-inside mt-2">
              <li>Example: AWS Bedrock</li>
              <li>Example: CI/CD Pipelines</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-green-800">
            <p className="font-bold">Matching Strengths</p>
            <p className="mt-2">Your experience with Go and Python aligns well with this role.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-800">
            <p className="font-bold">Suggested Actions</p>
            <p className="mt-2">Quantify your achievements in your LLM projects.</p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setStep('upload')}
        className="text-teal-600 font-medium hover:underline"
      >
        ← Back to upload
      </button>
    </div>
  );
};

export default JDMatcher;