// src/utils/textCleaner.js - Clean and format resume text

/**
 * Clean text by removing common artifacts and normalizing
 * @param {string} text - Text to clean
 * @param {string} type - Type of text (section, subsection, bullet)
 * @returns {string} - Cleaned text
 */
export const cleanText = (text, type = 'general') => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let cleaned = text;

  // Remove common markdown/formatting artifacts
  cleaned = cleaned.replace(/```[\w]*\n?/g, ''); // Remove code block markers
  cleaned = cleaned.replace(/^\s*[-*•]\s*/gm, ''); // Remove bullet points at start
  cleaned = cleaned.replace(/^\s*\d+\.\s*/gm, ''); // Remove numbered list markers
  
  // Remove excessive whitespace
  cleaned = cleaned.replace(/\s+/g, ' '); // Multiple spaces to single space
  cleaned = cleaned.replace(/\n\s*\n/g, '\n'); // Multiple newlines to single
  
  // Remove common noise patterns
  cleaned = cleaned.replace(/\[.*?\]/g, ''); // Remove [tags]
  cleaned = cleaned.replace(/<.*?>/g, ''); // Remove <tags>
  
  // Type-specific cleaning
  switch (type) {
    case 'section':
      // Section names - remove common prefixes
      cleaned = cleaned.replace(/^(section|chapter|part):\s*/i, '');
      // Title case
      cleaned = cleaned.replace(/\b\w/g, char => char.toUpperCase());
      break;
      
    case 'subsection':
      // Subsection titles - clean but preserve casing
      cleaned = cleaned.replace(/^(title|heading):\s*/i, '');
      break;
      
    case 'bullet':
      // Bullet points - preserve content as is
      break;
      
    default:
      break;
  }
  
  // Final trim
  cleaned = cleaned.trim();
  
  // Remove if only contains special characters or is too short
  if (cleaned.length < 2 || /^[^a-zA-Z0-9]+$/.test(cleaned)) {
    return '';
  }
  
  return cleaned;
};

/**
 * Clean section name
 */
export const cleanSectionName = (sectionName) => {
  return cleanText(sectionName, 'section');
};

/**
 * Clean subsection title
 */
export const cleanSubsectionTitle = (title) => {
  return cleanText(title, 'subsection');
};

/**
 * Clean bullet point data
 */
export const cleanBulletPoint = (bullet) => {
  return cleanText(bullet, 'bullet');
};

/**
 * Check if text is valid (not empty after cleaning)
 */
export const isValidText = (text) => {
  const cleaned = cleanText(text);
  return cleaned.length > 0 && cleaned !== 'NA' && cleaned !== 'N/A';
};