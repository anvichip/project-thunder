// src/services/api.js - FIXED with better error handling
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response from:', response.config.url, '- Status:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      
      if (error.response.status === 401) {
        console.log('Unauthorized - clearing auth data');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth_method');
        // Don't redirect if we're already on login page
        if (!window.location.pathname.includes('login')) {
          window.location.href = '/';
        }
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
      console.error('Is backend running on', API_BASE_URL, '?');
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (username, email, password) => {
    try {
      console.log('Registering user:', email);
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
      });
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      console.log('Logging in user:', email);
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  firebaseAuth: async (uid, email, name, photoURL) => {
    try {
      console.log('Firebase auth for user:', email);
      const response = await api.post('/api/auth/firebase', {
        uid,
        email,
        name,
        photoURL,
      });
      console.log('Firebase auth response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Firebase auth failed:', error);
      throw error;
    }
  },

  getMe: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get me failed:', error);
      throw error;
    }
  },

  logout: () => {
    console.log('Logging out user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_method');
  },
};

export const resumeAPI = {
  uploadResume: async (file, userId) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const response = await api.post('/api/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Resume upload failed:', error);
      throw error;
    }
  },

  // LaTeX Editor APIs
  compileLatex: async (content, email) => {
    try {
      const response = await api.post('/api/compile-latex', {
        content,
        email,
      });
      return response.data;
    } catch (error) {
      console.error('LaTeX compilation failed:', error);
      throw error;
    }
  },

  getDefaultLatexTemplate: async () => {
    try {
      const response = await api.get('/api/default-latex-template');
      return response.data;
    } catch (error) {
      console.error('Get default template failed:', error);
      throw error;
    }
  },

  saveDraft: async (email, name, content) => {
    try {
      const response = await api.post('/api/save-draft', {
        email,
        name,
        content,
      });
      return response.data;
    } catch (error) {
      console.error('Save draft failed:', error);
      throw error;
    }
  },

  getResumeDrafts: async (email) => {
    try {
      const response = await api.get(`/api/drafts/${email}`);
      return response.data;
    } catch (error) {
      console.error('Get drafts failed:', error);
      throw error;
    }
  },

  getDraft: async (draftId) => {
    try {
      const response = await api.get(`/api/draft/${draftId}`);
      return response.data;
    } catch (error) {
      console.error('Get draft failed:', error);
      throw error;
    }
  },

  deleteDraft: async (draftId) => {
    try {
      const response = await api.delete(`/api/draft/${draftId}`);
      return response.data;
    } catch (error) {
      console.error('Delete draft failed:', error);
      throw error;
    }
  },

  generateStandardResume: async (email, format = 'pdf') => {
    try {
      console.log(`Generating standard resume for ${email} in ${format} format`);
      const response = await api.post('/api/generate-standard-resume', 
        { email, format },
        { responseType: 'blob' }
      );
      return response;
    } catch (error) {
      console.error('Standard resume generation failed:', error);
      throw error;
    }
  },

  previewStandardResume: async (email) => {
    try {
      console.log(`Previewing standard resume for ${email}`);
      const response = await api.post('/api/preview-standard-resume', 
        { email },
        { responseType: 'blob' }
      );
      return response;
    } catch (error) {
      console.error('Standard resume preview failed:', error);
      throw error;
    }
  },

  generateResume: async (formData) => {
    try {
      console.log('Generating resume from custom template');
      const response = await api.post('/api/generate-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      console.error('Resume generation failed:', error);
      throw error;
    }
  },

  previewResume: async (formData) => {
    try {
      console.log('Previewing custom resume');
      const response = await api.post('/api/preview-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      console.error('Resume preview failed:', error);
      throw error;
    }
  },

  getSavedTemplates: async (email) => {
    try {
      console.log(`Fetching saved templates for ${email}`);
      const response = await api.get(`/api/templates/${email}`);
      return response.data;
    } catch (error) {
      console.error('Get templates failed:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  generateFromSavedTemplate: async (email, templateId, format) => {
    try {
      console.log(`Generating from saved template ${templateId}`);
      const response = await api.post('/api/generate-from-template', {
        email,
        templateId,
        format,
      }, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      console.error('Generate from template failed:', error);
      throw error;
    }
  },

  getProfile: async (email) => {
    try {
      const response = await api.get(`/api/user-profile/${email}`);
      return response.data;
    } catch (error) {
      console.error('Get profile failed:', error);
      throw error;
    }
  },
};

export const profileAPI = {
  saveProfile: async (email, profileData, selectedRoles) => {
    try {
      const response = await api.post('/api/save-user-profile', {
        email,
        profileData,
        selectedRoles,
      });
      return response.data;
    } catch (error) {
      console.error('Save profile failed:', error);
      throw error;
    }
  },

  getProfile: async (email) => {
    try {
      const response = await api.get(`/api/user-profile/${email}`);
      return response.data;
    } catch (error) {
      console.error('Get profile failed:', error);
      throw error;
    }
  },

  updateProfile: async (email, profileData) => {
    try {
      const response = await api.put(`/api/user-profile/${email}`, {
        profileData,
      });
      return response.data;
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    }
  },

  updateRoles: async (email, selectedRoles) => {
    try {
      const response = await api.put(`/api/user-profile/${email}/roles`, {
        selectedRoles,
      });
      return response.data;
    } catch (error) {
      console.error('Update roles failed:', error);
      throw error;
    }
  },

  deleteProfile: async (email) => {
    try {
      const response = await api.delete(`/api/user-profile/${email}`);
      return response.data;
    } catch (error) {
      console.error('Delete profile failed:', error);
      throw error;
    }
  },
};

export default api;