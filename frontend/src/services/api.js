// src/services/api.js - COMPLETE FIXED VERSION
import axios from 'axios';

const API_BASE_URL = import.meta.env.REACT_BASE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth_method');
      if (!window.location.pathname.includes('login')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (username, email, password) => {
    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  auth0Login: async (authData) => {
    try {
      const response = await api.post('/api/auth/auth0-login', authData);
      return response.data;
    } catch (error) {
      console.error('Auth0 login API error:', error);
      throw error;
    }
  },

  logout: () => {
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

      console.log('Uploading resume:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        userId
      });

      const response = await api.post('/api/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000,
      });

      console.log('Resume upload response:', response.data);

      if (!response.data) {
        throw new Error('Empty response from server');
      }

      if (!response.data.extractedData) {
        console.error('Invalid response structure:', response.data);
        throw new Error('Server returned invalid data structure');
      }

      if (!response.data.extractedData.sections || !Array.isArray(response.data.extractedData.sections)) {
        console.error('Invalid sections data:', response.data.extractedData);
        throw new Error('Resume sections not properly extracted');
      }

      return response.data;
    } catch (error) {
      console.error('Resume upload error:', error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timed out. Please try again with a smaller file.');
      }
      
      if (error.response?.status === 413) {
        throw new Error('File is too large. Please upload a smaller file.');
      }

      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }

      throw error;
    }
  },

  // NEW: Get user's resume
  getUserResume: async (email) => {
    try {
      console.log('Fetching resume for:', email);
      
      if (!email) {
        throw new Error('Email is required');
      }

      const response = await api.get(`/api/user-resume/${email}`);
      console.log('Resume fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get resume error:', error);
      throw error;
    }
  },
};

export const profileAPI = {
  saveProfile: async (email, resumeData, selectedRoles) => {
    try {
      console.log('Saving profile:', {
        email,
        hasResumeData: !!resumeData,
        sectionsCount: resumeData?.sections?.length || 0,
        rolesCount: selectedRoles?.length || 0
      });

      if (!email) {
        throw new Error('Email is required');
      }

      if (!resumeData || !resumeData.sections || resumeData.sections.length === 0) {
        throw new Error('Resume data is required and must contain sections');
      }

      if (!selectedRoles || selectedRoles.length === 0) {
        throw new Error('At least one role must be selected');
      }

      const response = await api.post('/api/save-user-profile', {
        email,
        resumeData,
        selectedRoles,
      });

      console.log('Profile saved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Save profile error:', error);
      throw error;
    }
  },

  getProfile: async (email) => {
    try {
      console.log('Fetching profile for:', email);
      
      if (!email) {
        throw new Error('Email is required');
      }

      const response = await api.get(`/api/user-profile/${email}`);
      console.log('Profile fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  updateProfile: async (email, resumeData) => {
    try {
      console.log('Updating profile:', { email, hasResumeData: !!resumeData });

      if (!email) {
        throw new Error('Email is required');
      }

      if (!resumeData) {
        throw new Error('Resume data is required');
      }

      const response = await api.put(`/api/user-profile/${email}`, {
        resumeData,
      });

      console.log('Profile updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  updateRoles: async (email, selectedRoles) => {
    try {
      console.log('Updating roles:', { email, rolesCount: selectedRoles?.length });

      if (!email) {
        throw new Error('Email is required');
      }

      if (!selectedRoles || selectedRoles.length === 0) {
        throw new Error('At least one role must be selected');
      }

      const response = await api.put(`/api/user-profile/${email}/roles`, {
        selectedRoles,
      });

      console.log('Roles updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update roles error:', error);
      throw error;
    }
  },
};

export default api;