// src/components/ResumeEditor.jsx - Updated
import { useState, useEffect, useRef } from 'react';
import { resumeAPI } from '../services/api';

const ResumeEditor = ({ userData }) => {
  const [content, setContent] = useState('');
  const [compiling, setCompiling] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoCompile, setAutoCompile] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState('');
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [latexTemplates, setLatexTemplates] = useState([]);
  const [currentDraft, setCurrentDraft] = useState(null);
  const [currentResume, setCurrentResume] = useState(null);
  const [fontSize, setFontSize] = useState(14);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [resumeName, setResumeName] = useState('');
  const editorRef = useRef(null);
  const compileTimeoutRef = useRef(null);

  useEffect(() => {
    loadDrafts();
    loadLatexTemplates();
    loadDefaultTemplate();
  }, []);

  useEffect(() => {
    if (autoCompile && content) {
      if (compileTimeoutRef.current) {
        clearTimeout(compileTimeoutRef.current);
      }
      compileTimeoutRef.current = setTimeout(() => {
        handleCompile();
      }, 2000);
    }
    return () => {
      if (compileTimeoutRef.current) {
        clearTimeout(compileTimeoutRef.current);
      }
    };
  }, [content, autoCompile]);

  const loadDefaultTemplate = async () => {
    try {
      const template = await resumeAPI.getDefaultLatexTemplate();
      setContent(template.content);
    } catch (error) {
      console.error('Error loading template:', error);
      setContent(`% Resume Template
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{margin=1in}

\\begin{document}

\\section*{Name}
Your Name Here

\\section*{Contact}
Email: your.email@example.com

\\section*{Education}
Your education details here

\\section*{Experience}
Your experience details here

\\end{document}`);
    }
  };

  const loadDrafts = async () => {
    try {
      const drafts = await resumeAPI.getResumeDrafts(userData.email);
      setSavedDrafts(drafts);
    } catch (error) {
      console.error('Error loading drafts:', error);
    }
  };

  const loadLatexTemplates = async () => {
    try {
      const templates = await resumeAPI.getLatexTemplates(userData.email);
      setLatexTemplates(templates);
    } catch (error) {
      console.error('Error loading LaTeX templates:', error);
    }
  };

  const handleCompile = async () => {
    setCompiling(true);
    setError('');

    try {
      const response = await resumeAPI.compileLatex(content, userData.email);
      setPdfUrl(response.pdfUrl);
    } catch (error) {
      console.error('Compilation error:', error);
      setError(error.response?.data?.detail || 'Compilation failed');
    } finally {
      setCompiling(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const draftName = prompt('Enter draft name:');
      if (!draftName) return;

      await resumeAPI.saveDraft(userData.email, draftName, content);
      await loadDrafts();
      alert('Draft saved successfully!');
    } catch (error) {
      alert('Failed to save draft');
    }
  };

  const handleSaveAsResume = () => {
    if (!pdfUrl) {
      alert('Please compile the document first');
      return;
    }
    setShowSaveModal(true);
  };

  const handleConfirmSave = async () => {
    if (!resumeName.trim()) {
      alert('Please enter a name for your resume');
      return;
    }

    setSaving(true);
    try {
      await resumeAPI.saveLatexResume(
        userData.email,
        resumeName,
        content,
        pdfUrl
      );
      
      setShowSaveModal(false);
      setResumeName('');
      await loadLatexTemplates();
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Save resume error:', error);
      alert('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleLoadDraft = async (draftId) => {
    try {
      const draft = await resumeAPI.getDraft(draftId);
      setContent(draft.content);
      setCurrentDraft(draft);
      setPdfUrl(null);
    } catch (error) {
      alert('Failed to load draft');
    }
  };

  const handleLoadLatexTemplate = (template) => {
    setContent(template.content);
    setCurrentResume(template);
    setPdfUrl(template.pdfUrl);
    setCurrentDraft(null);
  };

  const handleDownloadPDF = async () => {
    if (!pdfUrl) {
      alert('Please compile first');
      return;
    }

    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download PDF');
    }
  };

  const insertText = (before, after = '') => {
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const formatBold = () => insertText('\\textbf{', '}');
  const formatItalic = () => insertText('\\textit{', '}');
  const formatUnderline = () => insertText('\\underline{', '}');
  const insertSection = () => insertText('\\section{', '}\n');
  const insertSubsection = () => insertText('\\subsection{', '}\n');
  const insertBullet = () => insertText('\\item ', '\n');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between gap-4 flex-wrap flex-shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-800">Resume Editor</h1>
          {(currentDraft || currentResume) && (
            <span className="text-sm text-gray-500">
              ({currentDraft?.name || currentResume?.name})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Formatting Tools */}
          <div className="flex items-center gap-1 border-r pr-2">
            <button
              onClick={formatBold}
              className="p-2 hover:bg-gray-100 rounded transition"
              title="Bold"
            >
              <span className="font-bold">B</span>
            </button>
            <button
              onClick={formatItalic}
              className="p-2 hover:bg-gray-100 rounded transition"
              title="Italic"
            >
              <span className="italic">I</span>
            </button>
            <button
              onClick={formatUnderline}
              className="p-2 hover:bg-gray-100 rounded transition"
              title="Underline"
            >
              <span className="underline">U</span>
            </button>
          </div>

          {/* Structure Tools */}
          <div className="flex items-center gap-1 border-r pr-2">
            <button
              onClick={insertSection}
              className="px-3 py-2 hover:bg-gray-100 rounded transition text-sm"
              title="Insert Section"
            >
              Section
            </button>
            <button
              onClick={insertSubsection}
              className="px-3 py-2 hover:bg-gray-100 rounded transition text-sm"
              title="Insert Subsection"
            >
              Subsection
            </button>
            <button
              onClick={insertBullet}
              className="px-3 py-2 hover:bg-gray-100 rounded transition text-sm"
              title="Insert Bullet"
            >
              • Bullet
            </button>
          </div>

          {/* Font Size */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Font:</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={12}>12px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
            </select>
          </div>

          {/* Auto-compile */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoCompile}
              onChange={(e) => setAutoCompile(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">Auto-compile</span>
          </label>

          {/* Action Buttons */}
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-medium"
          >
            💾 Save Draft
          </button>
          
          <button
            onClick={handleCompile}
            disabled={compiling}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition text-sm font-medium"
          >
            {compiling ? '⏳ Compiling...' : '▶️ Compile'}
          </button>

          {pdfUrl && (
            <>
              <button
                onClick={handleSaveAsResume}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
              >
                ✅ Save as Resume
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
              >
                ⬇️ Download
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex-shrink-0">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Saved Items */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-4">
            {/* Drafts Section */}
            <div className="mb-6">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">📝</span>
                Drafts
              </h2>
              {savedDrafts.length === 0 ? (
                <p className="text-sm text-gray-500">No drafts</p>
              ) : (
                <div className="space-y-2">
                  {savedDrafts.map((draft) => (
                    <button
                      key={draft.id}
                      onClick={() => handleLoadDraft(draft.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        currentDraft?.id === draft.id
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <p className="text-sm font-medium truncate">{draft.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(draft.updatedAt).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* LaTeX Resumes Section */}
            <div>
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">📄</span>
                My Resumes
              </h2>
              {latexTemplates.length === 0 ? (
                <p className="text-sm text-gray-500">No saved resumes</p>
              ) : (
                <div className="space-y-2">
                  {latexTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleLoadLatexTemplate(template)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        currentResume?.id === template.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <p className="text-sm font-medium truncate">{template.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(template.updatedAt).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 bg-white p-4 overflow-y-auto">
          <textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full font-mono border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            style={{ fontSize: `${fontSize}px` }}
            spellCheck={false}
          />
        </div>

        {/* PDF Preview */}
        <div className="w-1/2 bg-gray-100 border-l border-gray-200 overflow-y-auto">
          <div className="p-4 h-full">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-full border border-gray-300 rounded-lg bg-white"
                title="PDF Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg">No preview available</p>
                  <p className="text-sm mt-2">Click "Compile" to generate PDF</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Resume Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Save Resume</h2>
            <p className="text-gray-600 mb-6">
              Give your resume a name to save it to your collection
            </p>
            
            <input
              type="text"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              placeholder="e.g., Software Engineer Resume"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none mb-6"
              autoFocus
            />

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setResumeName('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={saving || !resumeName.trim()}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-medium"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeEditor;