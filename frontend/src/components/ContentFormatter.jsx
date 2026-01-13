// src/components/ContentFormatter.jsx - Format and Display Content
import React from 'react';

const ContentFormatter = ({ text, className = '' }) => {
  if (!text || text.trim() === '' || text === 'NA') {
    return null;
  }

  // Clean the text first - remove ALL markdown and special characters
  let cleanedText = text
    .replace(/\*\*/g, '')           // Remove **
    .replace(/\*/g, '')             // Remove *
    .replace(/__/g, '')             // Remove __
    .replace(/_/g, '')              // Remove _
    .replace(/^_-_\s*/g, '')        // Remove _-_ prefix
    .replace(/^--\s*/g, '')         // Remove -- prefix
    .replace(/^-_\s*/g, '')         // Remove -_ prefix
    .replace(/^_-\s*/g, '')         // Remove _- prefix
    .replace(/\s*\[\s*/g, '')       // Remove [ with spaces
    .replace(/\s*\]\s*/g, '')       // Remove ] with spaces
    .trim();

  // Check for different content types
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
  const phoneRegex = /(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;

  // Parse content into segments
  const parseContent = (text) => {
    const segments = [];
    let lastIndex = 0;

    // Find all URLs
    const urlMatches = Array.from(text.matchAll(urlRegex));
    const emailMatches = Array.from(text.matchAll(emailRegex));
    const phoneMatches = Array.from(text.matchAll(phoneRegex));

    // Combine and sort all matches
    const allMatches = [
      ...urlMatches.map(m => ({ type: 'url', match: m })),
      ...emailMatches.map(m => ({ type: 'email', match: m })),
      ...phoneMatches.map(m => ({ type: 'phone', match: m }))
    ].sort((a, b) => a.match.index - b.match.index);

    // Build segments
    allMatches.forEach(({ type, match }) => {
      // Add text before match
      if (match.index > lastIndex) {
        segments.push({
          type: 'text',
          content: text.substring(lastIndex, match.index)
        });
      }

      // Add match
      segments.push({
        type,
        content: match[0],
        index: match.index
      });

      lastIndex = match.index + match[0].length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex)
      });
    }

    return segments.length > 0 ? segments : [{ type: 'text', content: text }];
  };

  const segments = parseContent(cleanedText);

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        switch (segment.type) {
          case 'url':
            const displayUrl = segment.content
              .replace('https://', '')
              .replace('http://', '')
              .substring(0, 50);
            return (
              <a
                key={index}
                href={segment.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 break-all"
              >
                {displayUrl}
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            );

          case 'email':
            return (
              <a
                key={index}
                href={`mailto:${segment.content}`}
                className="text-blue-600 hover:text-blue-800 underline break-all"
              >
                {segment.content}
              </a>
            );

          case 'phone':
            return (
              <a
                key={index}
                href={`tel:${segment.content.replace(/\s/g, '')}`}
                className="text-blue-600 hover:text-blue-800 break-all"
              >
                {segment.content}
              </a>
            );

          default:
            return <span key={index}>{segment.content}</span>;
        }
      })}
    </span>
  );
};

export default ContentFormatter;