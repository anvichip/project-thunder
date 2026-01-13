// src/utils/textCleaner.js - Clean and format text content

/**
 * Remove all markdown formatting from text
 */
export const removeMarkdown = (text) => {
  if (!text) return '';
  
  let cleaned = text;
  
  // Remove bold markdown (**text** or __text__)
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1');
  cleaned = cleaned.replace(/__(.+?)__/g, '$1');
  
  // Remove italic markdown (*text* or _text_)
  cleaned = cleaned.replace(/\*(.+?)\*/g, '$1');
  cleaned = cleaned.replace(/_(.+?)_/g, '$1');
  
  // Remove strikethrough (~~text~~)
  cleaned = cleaned.replace(/~~(.+?)~~/g, '$1');
  
  // Remove inline code (`text`)
  cleaned = cleaned.replace(/`(.+?)`/g, '$1');
  
  return cleaned.trim();
};

/**
 * Clean bullet point prefixes
 */
export const cleanBulletPoint = (text) => {
  if (!text) return '';
  
  let cleaned = text.trim();
  
  // Remove common bullet point patterns
  cleaned = cleaned.replace(/^_-_\s*/g, '');
  cleaned = cleaned.replace(/^-_\s*/g, '');
  cleaned = cleaned.replace(/^_-\s*/g, '');
  cleaned = cleaned.replace(/^--\s*/g, '');
  cleaned = cleaned.replace(/^-\s*/g, '');
  cleaned = cleaned.replace(/^•\s*/g, '');
  cleaned = cleaned.replace(/^\*\s*/g, '');
  cleaned = cleaned.replace(/^→\s*/g, '');
  cleaned = cleaned.replace(/^›\s*/g, '');
  
  return cleaned;
};

/**
 * Clean section names (remove markdown and extra characters)
 */
export const cleanSectionName = (text) => {
  if (!text) return '';
  
  let cleaned = text;
  
  // Remove markdown
  cleaned = removeMarkdown(cleaned);
  
  // Remove extra asterisks
  cleaned = cleaned.replace(/\*+/g, '');
  
  // Remove brackets and pipes commonly used in parsing
  cleaned = cleaned.replace(/[\[\]{}()]/g, '');
  cleaned = cleaned.replace(/\|/g, '');
  
  // Clean up spacing
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
};

/**
 * Clean subsection titles
 */
export const cleanSubsectionTitle = (text) => {
  if (!text) return '';
  
  let cleaned = text;
  
  // Remove markdown
  cleaned = removeMarkdown(cleaned);
  
  // Remove common prefixes
  cleaned = cleaned.replace(/^#+\s*/g, ''); // Remove markdown headers
  
  return cleaned.trim();
};

/**
 * Clean contact information text
 */
export const cleanContactInfo = (text) => {
  if (!text) return '';
  
  let cleaned = text;
  
  // Remove markdown
  cleaned = removeMarkdown(cleaned);
  
  // Remove bullet points
  cleaned = cleanBulletPoint(cleaned);
  
  // Remove extra separators and brackets
  cleaned = cleaned.replace(/\s*\|\s*/g, ' | ');
  cleaned = cleaned.replace(/\s*\[\s*/g, '');
  cleaned = cleaned.replace(/\s*\]\s*/g, '');
  cleaned = cleaned.replace(/\s*\(\s*/g, '(');
  cleaned = cleaned.replace(/\s*\)\s*/g, ')');
  
  // Clean opening brackets/symbols at the start
  cleaned = cleaned.replace(/^[-\s]*[\[\](){}|]+\s*/g, '');
  
  return cleaned.trim();
};

/**
 * Master clean function - applies all cleaning rules
 */
export const cleanText = (text, type = 'default') => {
  if (!text || text === 'NA' || text === 'N/A') return '';
  
  switch (type) {
    case 'section':
      return cleanSectionName(text);
    
    case 'subsection':
      return cleanSubsectionTitle(text);
    
    case 'bullet':
      return cleanBulletPoint(text);
    
    case 'contact':
      return cleanContactInfo(text);
    
    default:
      // Default cleaning
      let cleaned = removeMarkdown(text);
      cleaned = cleanBulletPoint(cleaned);
      return cleaned;
  }
};

/**
 * Check if text is empty after cleaning
 */
export const isEmptyAfterCleaning = (text) => {
  const cleaned = cleanText(text);
  return !cleaned || cleaned === '';
};

export default {
  removeMarkdown,
  cleanBulletPoint,
  cleanSectionName,
  cleanSubsectionTitle,
  cleanContactInfo,
  cleanText,
  isEmptyAfterCleaning
};