// src/components/ResumePopup.jsx - Commercial Grade Design
import { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const ResumePopup = ({ resumeData, onClose, onCopyLink, userData }) => {
  const [resumeHtml, setResumeHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);

  const { user, isAuthenticated } = useAuth0();

  let userName = null;

  if (isAuthenticated) {
    userName = user.name;
  }

  const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:8000';
  };

  useEffect(() => {
    fetchProfileAndGenerateResume();
  }, [resumeData]);

  const fetchProfileAndGenerateResume = async () => {
    try {
      setLoading(true);
      setError('');

      const apiUrl = getApiUrl();
      const email = userData?.email || resumeData?.user_email;
      
      if (!email) {
        throw new Error('User email not found');
      }

      const profileResponse = await fetch(`${apiUrl}/api/user-profile/${email}`);
      
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const profile = await profileResponse.json();
      setProfileData(profile);

      const sections = profile.resumeData?.sections || resumeData.profile_data?.sections || [];
      const html = createResumeHtml(sections, profile);
      setResumeHtml(html);
    } catch (error) {
      console.error('❌ Error generating resume:', error);
      setError(error.message || 'Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const createResumeHtml = (sections, profile) => {
    const contactInfo = extractContactInfo(sections);
    const name = userName;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} – Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #f5f5f5;
      margin: 0;
      padding: 20px;
      line-height: 1.6;
      color: #1f2937;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 3em;
      border-radius: 8px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    header {
      text-align: center;
      margin-bottom: 2em;
      padding-bottom: 1.5em;
      border-bottom: 3px solid #6366f1;
    }
    h1 {
      margin: 0 0 0.5em 0;
      font-size: 2.5em;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.025em;
    }
    h2 {
      margin-top: 2em;
      padding-bottom: 6px;
      font-size: 1.4em;
      font-weight: 700;
      border-bottom: 2px solid #e5e7eb;
      color: #374151;
      margin-bottom: 1em;
      letter-spacing: -0.015em;
    }
    h3 {
      margin: 0.8em 0 0.3em 0;
      font-size: 1.15em;
      color: #111827;
      font-weight: 700;
    }
    address {
      font-style: normal;
      color: #4b5563;
      font-size: 0.95em;
      line-height: 1.7;
    }
    ul {
      margin: 0.5em 0 0.5em 1.2em;
      padding-left: 0;
    }
    li {
      margin: 0.35em 0;
      line-height: 1.6;
      color: #374151;
    }
    p {
      margin: 0.4em 0;
      font-size: 0.98em;
      color: #374151;
      line-height: 1.6;
    }
    a {
      color: #6366f1;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    a:hover { color: #4f46e5; text-decoration: underline; }
    .section { margin-bottom: 2em; }
    .subsection { margin-bottom: 1.2em; }
    .contact-links { margin-top: 0.6em; }
    .separator { margin: 0 0.4em; color: #9ca3af; }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; padding: 1em; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${name}</h1>
      <address>
        ${contactInfo.links.length > 0 ? `<div class="contact-links">${contactInfo.links.join(' <span class="separator">•</span> ')}</div>` : ''}
        ${contactInfo.email || contactInfo.phone ? `<div style="margin-top: 0.5em;">
          ${contactInfo.email || ''}${contactInfo.email && contactInfo.phone ? ' <span class="separator">•</span> ' : ''}${contactInfo.phone || ''}
        </div>` : ''}
      </address>
    </header>
    ${generateSectionsHtml(sections)}
  </div>
</body>
</html>`;
  };

  const extractContactInfo = (sections) => {
    const info = { name: '', email: '', phone: '', links: [] };

    if (!sections || !Array.isArray(sections)) return info;

    sections.forEach(section => {
      const sectionName = section.section_name?.toLowerCase() || '';
      
      if (sectionName.includes('contact') || sectionName.includes('personal')) {
        section.subsections?.forEach(subsection => {
          const title = subsection.title?.toLowerCase() || '';
          const data = subsection.data || [];

          if (subsection.title && !info.name) {
            const titleWords = subsection.title.split(' ');
            if (titleWords.length >= 2 && titleWords.length <= 4) {
              const hasCapitals = titleWords.every(word => /^[A-Z]/.test(word));
              if (hasCapitals && !title.includes('email') && !title.includes('phone')) {
                info.name = subsection.title;
              }
            }
          }

          data.forEach(item => {
            if (!info.email && item.includes('@')) {
              const emailMatch = item.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
              if (emailMatch) info.email = emailMatch[1];
            }

            if (!info.phone && /[\d\+\-\(\)\s]{8,}/.test(item)) {
              const phoneMatch = item.match(/(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/);
              if (phoneMatch) info.phone = phoneMatch[1];
            }

            if (item.toLowerCase().includes('github') || item.includes('github.com')) {
              const match = item.match(/(https?:\/\/github\.com\/[^\s)]+|github\.com\/[^\s)]+)/i);
              if (match) {
                const url = match[1].startsWith('http') ? match[1] : `https://${match[1]}`;
                info.links.push(`<a href="${url}">GitHub</a>`);
              }
            }

            if (item.toLowerCase().includes('linkedin') || item.includes('linkedin.com')) {
              const match = item.match(/(https?:\/\/(?:www\.)?linkedin\.com\/[^\s)]+|linkedin\.com\/[^\s)]+)/i);
              if (match) {
                const url = match[1].startsWith('http') ? match[1] : `https://${match[1]}`;
                info.links.push(`<a href="${url}">LinkedIn</a>`);
              }
            }

            if ((item.includes('http') || item.includes('www.')) && 
                !item.toLowerCase().includes('github') && 
                !item.toLowerCase().includes('linkedin')) {
              const match = item.match(/(https?:\/\/[^\s)]+|www\.[^\s)]+)/i);
              if (match) {
                const url = match[1].startsWith('http') ? match[1] : `https://${match[1]}`;
                info.links.push(`<a href="${url}">Portfolio</a>`);
              }
            }
          });
        });
      }
    });

    info.links = [...new Set(info.links)];
    return info;
  };

  const generateSectionsHtml = (sections) => {
    return sections
      .filter(section => {
        const name = section.section_name?.toLowerCase() || '';
        return !name.includes('contact') && !name.includes('personal information');
      })
      .map(section => {
        const sectionName = section.section_name || 'Section';
        const subsections = section.subsections || [];

        return `
    <section class="section">
      <h2>${sectionName}</h2>
      ${subsections.map(subsection => generateSubsectionHtml(subsection, sectionName)).join('\n')}
    </section>`;
      })
      .join('\n');
  };

  const generateSubsectionHtml = (subsection, sectionName) => {
    const title = subsection.title || '';
    const data = subsection.data || [];
    const sectionLower = sectionName.toLowerCase();

    if (sectionLower.includes('skill') || sectionLower.includes('technical')) {
      return `
      <div class="subsection">
        ${title ? `<p><strong>${title}:</strong> ${data.join(', ')}</p>` : `<p>${data.join(', ')}</p>`}
      </div>`;
    }

    if (sectionLower.includes('achievement') || sectionLower.includes('award')) {
      return `
      <div class="subsection">
        <ul>
          ${title ? `<li><strong>${title}:</strong> ${data.join(' ')}</li>` : data.map(item => `<li>${item}</li>`).join('\n')}
        </ul>
      </div>`;
    }

    if (sectionLower.includes('coursework') || sectionLower.includes('course')) {
      return `
      <div class="subsection">
        ${title ? `<p><strong>${title}:</strong></p>` : ''}
        <ul>
          ${data.map(item => `<li>${item}</li>`).join('\n')}
        </ul>
      </div>`;
    }

    if (sectionLower.includes('education') || sectionLower.includes('experience') || sectionLower.includes('project') || sectionLower.includes('position')) {
      return `
      <div class="subsection">
        ${title ? `<h3>${title}</h3>` : ''}
        ${data.length > 0 ? `
        ${data[0] && !data[0].startsWith('_•_') ? `<p>${data[0]}</p>` : ''}
        ${data.filter(item => item.startsWith('_•_') || data.length > 1 && data.indexOf(item) > 0).length > 0 ? `
        <ul class="subsection-data">
          ${data.filter(item => item.startsWith('_•_') || (data.length > 1 && data.indexOf(item) > 0 && !data[0].startsWith('_•_'))).map(item => {
            const cleanItem = item.replace(/^_•_\s*/, '');
            return `<li>${cleanItem}</li>`;
          }).join('\n')}
        </ul>` : ''}` : ''}
      </div>`;
    }

    return `
      <div class="subsection">
        ${title ? `<h3>${title}</h3>` : ''}
        ${data.length > 0 ? `
        <ul class="subsection-data">
          ${data.map(item => `<li>${item}</li>`).join('\n')}
        </ul>` : ''}
      </div>`;
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleOpenInNewTab = () => {
    const apiUrl = getApiUrl();
    const fullUrl = `${apiUrl}${resumeData.sharable_link}`;
    window.open(fullUrl, '_blank');
  };

  const handleCopyLink = async () => {
    const apiUrl = getApiUrl();
    const fullUrl = `${apiUrl}${resumeData.sharable_link}`;
    
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = fullUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err2) {
        console.error('Fallback copy failed:', err2);
      }
      document.body.removeChild(textArea);
    }
  };

  const metadata = resumeData.metadata || {};
  const apiUrl = getApiUrl();
  const sharableUrl = `${apiUrl}${resumeData.sharable_link}`;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-100">
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 px-10 py-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-xl flex items-center justify-center shadow-lg border border-white/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {metadata.name || 'Your Resume'}
              </h2>
              {metadata.title && (
                <p className="text-sm text-indigo-200 font-medium mt-1">{metadata.title}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all duration-200 backdrop-blur-xl border border-white/20 group"
          >
            <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Share Section */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-b-2 border-indigo-200 px-8 py-6 flex-shrink-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Shareable Link</h3>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-5 py-4 border-2 border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
                <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <input
                  type="text"
                  readOnly
                  value={sharableUrl}
                  className="flex-1 text-sm text-gray-700 bg-transparent outline-none font-mono font-medium"
                  onClick={(e) => e.target.select()}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition-all duration-200 font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    copied
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleOpenInNewTab}
                  className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="hidden sm:inline">Open</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="font-semibold">{resumeData.view_count || 0} <span className="font-normal text-gray-500">views</span></span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-normal text-gray-600">Updated <span className="font-semibold text-gray-900">{new Date(resumeData.updated_at).toLocaleDateString()}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-700 font-semibold text-lg">Loading preview...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md bg-white rounded-2xl p-8 shadow-xl">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Preview Unavailable</h3>
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
              <iframe
                srcDoc={resumeHtml}
                className="w-full border-none"
                style={{ minHeight: '600px', height: '70vh' }}
                title="Resume Preview"
                sandbox="allow-same-origin allow-popups"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-medium">Anyone with this link can view your resume</span>
          </div>
          
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-bold"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ResumePopup;