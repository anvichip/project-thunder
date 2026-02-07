// src/components/Documentation.jsx - App documentation and help
import { useState } from 'react';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      content: `
        <h3 class="text-xl font-bold text-gray-900 mb-4">Welcome to Resume Unlocked</h3>
        <p class="text-gray-700 mb-4 leading-relaxed">Resume Unlocked is your AI-powered career companion that transforms your traditional resume into a dynamic, shareable profile.</p>
        
        <h4 class="text-lg font-bold text-gray-900 mb-3 mt-6">Quick Start Guide</h4>
        <ol class="space-y-3 text-gray-700">
          <li class="flex items-start gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</span>
            <span><strong>Upload Your Resume:</strong> Click on "My Profile" and upload your PDF or DOCX resume file.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</span>
            <span><strong>AI Processing:</strong> Our AI will automatically extract and organize your information into structured sections.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</span>
            <span><strong>Select Your Roles:</strong> Choose the career roles that match your interests and experience.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">4</span>
            <span><strong>Share Your Profile:</strong> Get a shareable link to your professional resume that you can send to recruiters and employers.</span>
          </li>
        </ol>

        <div class="bg-blue-50 border-l-4 border-blue-600 p-4 mt-6 rounded-r-lg">
          <p class="text-sm text-blue-900"><strong>💡 Tip:</strong> Keep your profile updated regularly to ensure recruiters always see your latest achievements and skills.</p>
        </div>
      `
    },
    {
      id: 'features',
      title: 'Key Features',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      content: `
        <h3 class="text-xl font-bold text-gray-900 mb-4">Powerful Features</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">AI Resume Parsing</h4>
            <p class="text-gray-600 text-sm">Advanced AI technology automatically extracts information from your resume, organizing it into clean, structured sections.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <div class="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Shareable Profile Link</h4>
            <p class="text-gray-600 text-sm">Generate a unique, professional URL for your resume that you can share anywhere - email, LinkedIn, job applications.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Analytics Dashboard</h4>
            <p class="text-gray-600 text-sm">Track who views your resume, see engagement metrics, and understand how recruiters interact with your profile.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">JD Matcher</h4>
            <p class="text-gray-600 text-sm">Compare your profile against job descriptions to see how well you match and get suggestions for improvement.</p>
          </div>
        </div>
      `
    },
    {
      id: 'profile',
      title: 'Managing Your Profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      content: `
        <h3 class="text-xl font-bold text-gray-900 mb-4">Profile Management</h3>
        
        <h4 class="text-lg font-bold text-gray-900 mb-3">Editing Your Information</h4>
        <p class="text-gray-700 mb-4 leading-relaxed">You can edit your profile information at any time by clicking the "Edit Profile" button on your profile page.</p>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h5 class="font-bold text-gray-900 mb-2">What you can edit:</h5>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>Section titles and subsection titles</span>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>Individual bullet points and details</span>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>Add or remove subsections</span>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>Your selected career roles</span>
            </li>
          </ul>
        </div>

        <h4 class="text-lg font-bold text-gray-900 mb-3 mt-6">Viewing Your Profile by Category</h4>
        <p class="text-gray-700 mb-4 leading-relaxed">Use the mini tabs at the top of your profile to quickly navigate between different sections:</p>
        <ul class="space-y-2 text-gray-700 mb-6">
          <li class="flex items-start gap-3">
            <span class="font-bold text-blue-600">Overview:</span>
            <span>See all your profile sections at once</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="font-bold text-blue-600">Experience:</span>
            <span>Focus on your work history and professional experience</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="font-bold text-blue-600">Education:</span>
            <span>View your educational background and qualifications</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="font-bold text-blue-600">Skills:</span>
            <span>See all your technical and professional skills</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="font-bold text-blue-600">Other:</span>
            <span>Additional sections like projects, certifications, etc.</span>
          </li>
        </ul>
      `
    },
    {
      id: 'sharing',
      title: 'Sharing Your Resume',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      ),
      content: `
        <h3 class="text-xl font-bold text-gray-900 mb-4">Share Your Profile</h3>
        
        <p class="text-gray-700 mb-6 leading-relaxed">Your resume is automatically available at a unique URL that you can share with anyone. This link never expires and always shows your most up-to-date information.</p>

        <h4 class="text-lg font-bold text-gray-900 mb-3">How to Share Your Resume</h4>
        <ol class="space-y-4 text-gray-700 mb-6">
          <li class="flex items-start gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <strong class="block mb-1">Go to "My Resumes"</strong>
              <span class="text-sm">Navigate to the My Resumes section from your dashboard.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <strong class="block mb-1">Click "Share" or "Copy Link"</strong>
              <span class="text-sm">Your unique resume URL will be copied to your clipboard.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <strong class="block mb-1">Share the Link</strong>
              <span class="text-sm">Paste the link in emails, LinkedIn messages, job applications, or anywhere else.</span>
            </div>
          </li>
        </ol>

        <div class="bg-green-50 border-l-4 border-green-600 p-4 mb-6 rounded-r-lg">
          <p class="text-sm text-green-900"><strong>✓ Best Practice:</strong> Include your resume link in your email signature, LinkedIn "About" section, and on your personal website.</p>
        </div>

        <h4 class="text-lg font-bold text-gray-900 mb-3">Privacy & Security</h4>
        <ul class="space-y-2 text-gray-700">
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            <span>Your resume is only accessible via the direct link - it's not indexed by search engines.</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            <span>You maintain full control - update or remove information anytime from your dashboard.</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            <span>Anyone with the link can view your resume - only share it with trusted individuals.</span>
          </li>
        </ul>
      `
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      content: `
        <h3 class="text-xl font-bold text-gray-900 mb-4">Understanding Your Analytics</h3>
        
        <p class="text-gray-700 mb-6 leading-relaxed">The Analytics Dashboard provides deep insights into how recruiters and employers are interacting with your resume.</p>

        <h4 class="text-lg font-bold text-gray-900 mb-3">Key Metrics</h4>
        <div class="space-y-4 mb-6">
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <h5 class="font-bold text-gray-900 mb-2">📊 Total Views</h5>
            <p class="text-sm text-gray-600">The number of times your resume has been viewed. Track trends to see when your resume gets the most attention.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <h5 class="font-bold text-gray-900 mb-2">⏱️ Average Time</h5>
            <p class="text-sm text-gray-600">How long visitors spend reading your resume on average. Higher times typically indicate stronger engagement.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <h5 class="font-bold text-gray-900 mb-2">🎯 Click Rate</h5>
            <p class="text-sm text-gray-600">The percentage of viewers who click on your links (LinkedIn, GitHub, portfolio). Shows how well your profile drives action.</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <h5 class="font-bold text-gray-900 mb-2">🔥 Engagement Score</h5>
            <p class="text-sm text-gray-600">Overall engagement based on time spent, scroll depth, and link clicks. Higher scores mean better resume performance.</p>
          </div>
        </div>

        <h4 class="text-lg font-bold text-gray-900 mb-3">Advanced Insights</h4>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-3">
            <span class="font-bold text-blue-600">Traffic Sources:</span>
            <span>See where your viewers are coming from (LinkedIn, Indeed, direct links, etc.)</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="font-bold text-blue-600">Peak Activity Times:</span>
            <span>Discover when your resume gets the most views to time your outreach</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="font-bold text-blue-600">Section Attention:</span>
            <span>Learn which sections of your resume get the most attention</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="font-bold text-blue-600">Behavior Clusters:</span>
            <span>Understand different viewer engagement patterns (bounce, skim, engaged)</span>
          </li>
        </ul>
      `
    },
    {
      id: 'jd-matcher',
      title: 'JD Matcher',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      content: `
        <h3 class="text-xl font-bold text-gray-900 mb-4">Job Description Matcher</h3>
        
        <p class="text-gray-700 mb-6 leading-relaxed">The JD Matcher tool helps you compare your resume against specific job postings to see how well you match and where you can improve.</p>

        <h4 class="text-lg font-bold text-gray-900 mb-3">How to Use JD Matcher</h4>
        <ol class="space-y-4 text-gray-700 mb-6">
          <li class="flex items-start gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <strong class="block mb-1">Copy the Job Description</strong>
              <span class="text-sm">Find a job posting you're interested in and copy the full job description text.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <strong class="block mb-1">Paste into JD Matcher</strong>
              <span class="text-sm">Navigate to the JD Matcher section and paste the job description.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <strong class="block mb-1">Analyze Match</strong>
              <span class="text-sm">Our AI will analyze your profile against the job requirements and show you a match score.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">4</span>
            <div>
              <strong class="block mb-1">Review Recommendations</strong>
              <span class="text-sm">Get specific suggestions on skills to highlight or areas to strengthen in your profile.</span>
            </div>
          </li>
        </ol>

        <div class="bg-purple-50 border-l-4 border-purple-600 p-4 mb-6 rounded-r-lg">
          <p class="text-sm text-purple-900"><strong>💡 Pro Tip:</strong> Use JD Matcher before applying to jobs to tailor your profile and increase your chances of getting noticed.</p>
        </div>

        <h4 class="text-lg font-bold text-gray-900 mb-3">What JD Matcher Analyzes</h4>
        <ul class="space-y-2 text-gray-700">
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Required skills and how many you possess</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Relevant experience and years of expertise</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Education requirements and qualifications</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Keywords and terminology alignment</span>
          </li>
        </ul>
      `
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: `
        <h3 class="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
        
        <div class="space-y-4">
          <details class="bg-white border border-gray-200 rounded-lg p-5">
            <summary class="font-bold text-gray-900 cursor-pointer">How secure is my data?</summary>
            <p class="mt-3 text-gray-700 text-sm leading-relaxed">Your data is encrypted and stored securely. We never sell or share your personal information with third parties. Your resume is only accessible via your unique link.</p>
          </details>

          <details class="bg-white border border-gray-200 rounded-lg p-5">
            <summary class="font-bold text-gray-900 cursor-pointer">Can I update my resume after creating it?</summary>
            <p class="mt-3 text-gray-700 text-sm leading-relaxed">Yes! You can edit your profile anytime from the dashboard. Any changes you make will be immediately reflected in your shareable link.</p>
          </details>

          <details class="bg-white border border-gray-200 rounded-lg p-5">
            <summary class="font-bold text-gray-900 cursor-pointer">What file formats are supported for upload?</summary>
            <p class="mt-3 text-gray-700 text-sm leading-relaxed">We currently support PDF (.pdf) and Microsoft Word (.docx, .doc) formats. For best results, use a standard, well-formatted resume.</p>
          </details>

          <details class="bg-white border border-gray-200 rounded-lg p-5">
            <summary class="font-bold text-gray-900 cursor-pointer">How does the AI parsing work?</summary>
            <p class="mt-3 text-gray-700 text-sm leading-relaxed">Our AI uses advanced natural language processing to identify and extract information from your resume, automatically organizing it into structured sections like experience, education, skills, etc.</p>
          </details>

          <details class="bg-white border border-gray-200 rounded-lg p-5">
            <summary class="font-bold text-gray-900 cursor-pointer">Can I delete my account and data?</summary>
            <p class="mt-3 text-gray-700 text-sm leading-relaxed">Yes, you can delete your account and all associated data at any time from your account settings. This action is permanent and cannot be undone.</p>
          </details>

          <details class="bg-white border border-gray-200 rounded-lg p-5">
            <summary class="font-bold text-gray-900 cursor-pointer">Is there a mobile app?</summary>
            <p class="mt-3 text-gray-700 text-sm leading-relaxed">Resume Unlocked is fully responsive and works great on mobile browsers. We're currently working on native mobile apps for iOS and Android.</p>
          </details>

          <details class="bg-white border border-gray-200 rounded-lg p-5">
            <summary class="font-bold text-gray-900 cursor-pointer">How many resumes can I create?</summary>
            <p class="mt-3 text-gray-700 text-sm leading-relaxed">Currently, you can have one active resume profile per account. We're working on multi-resume support for users who want different versions for different roles.</p>
          </details>

          <details class="bg-white border border-gray-200 rounded-lg p-5">
            <summary class="font-bold text-gray-900 cursor-pointer">Do you offer customer support?</summary>
            <p class="mt-3 text-gray-700 text-sm leading-relaxed">Yes! Contact us at support@resumeunlocked.com for any questions or issues. We typically respond within 24 hours.</p>
          </details>
        </div>
      `
    }
  ];

  const activeContent = sections.find(s => s.id === activeSection);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card-elevated p-8 fade-in">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
            <p className="text-gray-600 mt-1">Learn how to make the most of Resume Unlocked</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card-elevated sticky top-24">
            <nav className="p-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 px-3">Sections</h3>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1
                    ${activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {section.icon}
                  <span className="text-left">{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="card-elevated p-8 fade-in">
            <div 
              className="prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: activeContent.content }}
            />
          </div>

          {/* Contact Support */}
          <div className="card-elevated p-6 mt-6 bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Need More Help?</h3>
                <p className="text-gray-700 text-sm mb-4">Can't find what you're looking for? Our support team is here to help!</p>
                <a 
                  href="mailto:support@resumeunlocked.com" 
                  className="btn btn-primary text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;