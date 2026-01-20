// src/components/ContentFormatter.jsx
// Utility component to format content with links, emails, etc.
import React from 'react';

const ContentFormatter = ({ text }) => {
  if (!text) return null;

  // Parse content to identify URLs, emails, etc.
  const parseContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    
    let parts = [];
    let lastIndex = 0;
    
    // Find all URLs
    let match;
    const matches = [];
    
    while ((match = urlRegex.exec(content)) !== null) {
      matches.push({ 
        index: match.index, 
        length: match[0].length, 
        type: 'url', 
        value: match[0] 
      });
    }
    
    // Reset regex
    emailRegex.lastIndex = 0;
    
    // Find all emails
    while ((match = emailRegex.exec(content)) !== null) {
      // Check if this email is not part of a URL
      const isPartOfUrl = matches.some(m => 
        match.index >= m.index && match.index < m.index + m.length
      );
      if (!isPartOfUrl) {
        matches.push({ 
          index: match.index, 
          length: match[0].length, 
          type: 'email', 
          value: match[0] 
        });
      }
    }
    
    // Sort by index
    matches.sort((a, b) => a.index - b.index);
    
    // Build parts array
    matches.forEach((match) => {
      if (match.index > lastIndex) {
        parts.push({ 
          type: 'text', 
          value: content.substring(lastIndex, match.index) 
        });
      }
      parts.push(match);
      lastIndex = match.index + match.length;
    });
    
    if (lastIndex < content.length) {
      parts.push({ 
        type: 'text', 
        value: content.substring(lastIndex) 
      });
    }
    
    return parts.length > 0 ? parts : [{ type: 'text', value: content }];
  };

  const formatUrlDisplay = (url) => {
    let display = url.replace('https://', '').replace('http://', '');
    if (display.length > 40) {
      display = display.substring(0, 40) + '...';
    }
    return display;
  };

  const parts = parseContent(text);

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'url') {
          return (
            <a
              key={index}
              href={part.value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline break-words"
              title={part.value}
            >
              {formatUrlDisplay(part.value)}
            </a>
          );
        } else if (part.type === 'email') {
          return (
            <a
              key={index}
              href={`mailto:${part.value}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {part.value}
            </a>
          );
        } else {
          return <span key={index}>{part.value}</span>;
        }
      })}
    </>
  );
};

export default ContentFormatter;