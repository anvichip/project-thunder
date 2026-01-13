// src/utils/textUtils.js - Text Formatting Utilities

/**
 * Extract and format URLs from text
 */
export const extractUrls = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
};

/**
 * Extract email addresses from text
 */
export const extractEmails = (text) => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
  return text.match(emailRegex) || [];
};

/**
 * Extract phone numbers from text
 */
export const extractPhones = (text) => {
  const phoneRegex = /(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;
  return text.match(phoneRegex) || [];
};

/**
 * Check if text contains a URL
 */
export const containsUrl = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return urlRegex.test(text);
};

/**
 * Check if text contains an email
 */
export const containsEmail = (text) => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
  return emailRegex.test(text);
};

/**
 * Format URL for display (truncate if too long)
 */
export const formatUrlDisplay = (url, maxLength = 50) => {
  let displayUrl = url.replace('https://', '').replace('http://', '');
  if (displayUrl.length > maxLength) {
    displayUrl = displayUrl.substring(0, maxLength) + '...';
  }
  return displayUrl;
};

/**
 * Clean and format text - remove markdown asterisks
 */
export const cleanText = (text) => {
  if (!text) return '';
  
  // Remove markdown bold/italic markers
  let cleaned = text.replace(/\*\*/g, '');
  cleaned = cleaned.replace(/\*/g, '');
  
  // Remove extra spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
};

/**
 * Parse text with mixed content (URLs, emails, etc.)
 */
export const parseContent = (text) => {
  if (!text) return [];
  
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
  const phoneRegex = /(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;
  
  // Split by all patterns
  const parts = [];
  let lastIndex = 0;
  
  // Find all matches
  const matches = [];
  
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    matches.push({ index: match.index, length: match[0].length, type: 'url', value: match[0] });
  }
  
  while ((match = emailRegex.exec(text)) !== null) {
    matches.push({ index: match.index, length: match[0].length, type: 'email', value: match[0] });
  }
  
  while ((match = phoneRegex.exec(text)) !== null) {
    matches.push({ index: match.index, length: match[0].length, type: 'phone', value: match[0] });
  }
  
  // Sort matches by index
  matches.sort((a, b) => a.index - b.index);
  
  // Build parts array
  matches.forEach((match) => {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.substring(lastIndex, match.index) });
    }
    parts.push(match);
    lastIndex = match.index + match.length;
  });
  
  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.substring(lastIndex) });
  }
  
  return parts.length > 0 ? parts : [{ type: 'text', value: text }];
};

/**
 * Get section icon based on section name
 */
export const getSectionIcon = (sectionName) => {
  const name = sectionName.toLowerCase();
  
  const iconMap = {
    'contact': '📧',
    'personal': '👤',
    'education': '🎓',
    'experience': '💼',
    'work': '💼',
    'skill': '🛠️',
    'technical': '🛠️',
    'project': '🚀',
    'achievement': '🏆',
    'award': '🏆',
    'certification': '📜',
    'certificate': '📜',
    'publication': '📚',
    'research': '🔬',
    'responsibility': '📋',
    'position': '📋',
    'leadership': '👔',
    'volunteer': '🤝',
    'language': '🌍',
    'interest': '🎯',
    'hobby': '🎨',
    'reference': '📝',
    'summary': '📄',
    'objective': '🎯',
    'about': '💡'
  };
  
  for (const [key, icon] of Object.entries(iconMap)) {
    if (name.includes(key)) {
      return icon;
    }
  }
  
  return '📋'; // Default icon
};

/**
 * Format date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Convert to title case
 */
export const toTitleCase = (text) => {
  if (!text) return '';
  return text.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

/**
 * Remove special characters
 */
export const removeSpecialChars = (text) => {
  if (!text) return '';
  return text.replace(/[^a-zA-Z0-9\s]/g, '');
};

/**
 * Check if text is empty or whitespace
 */
export const isEmpty = (text) => {
  return !text || text.trim() === '' || text === 'NA' || text === 'N/A';
};

/**
 * Format bullet points
 */
export const formatBulletPoints = (text) => {
  if (!text) return '';
  
  // Add bullet point if not present
  if (!text.trim().startsWith('•') && !text.trim().startsWith('-')) {
    return '• ' + text;
  }
  
  // Replace dash with bullet
  if (text.trim().startsWith('-')) {
    return text.replace(/^-\s*/, '• ');
  }
  
  return text;
};

export default {
  extractUrls,
  extractEmails,
  extractPhones,
  containsUrl,
  containsEmail,
  formatUrlDisplay,
  cleanText,
  parseContent,
  getSectionIcon,
  formatDate,
  truncateText,
  capitalizeFirst,
  toTitleCase,
  removeSpecialChars,
  isEmpty,
  formatBulletPoints
};