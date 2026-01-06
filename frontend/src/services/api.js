// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (username, email, password) => {
    const response = await api.post('/api/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  firebaseAuth: async (uid, email, name, photoURL) => {
    const response = await api.post('/api/auth/firebase', {
      uid,
      email,
      name,
      photoURL,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },
};

export const resumeAPI = {
  uploadResume: async (file, userId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    const response = await api.post('/api/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const profileAPI = {
  saveProfile: async (email, profileData, selectedRoles) => {
    const response = await api.post('/api/save-user-profile', {
      email,
      profileData,
      selectedRoles,
    });
    return response.data;
  },

  getProfile: async (email) => {
    const response = await api.get(`/api/user-profile/${email}`);
    return response.data;
  },

  updateProfile: async (email, profileData) => {
    const response = await api.put(`/api/user-profile/${email}`, {
      profileData,
    });
    return response.data;
  },

  updateRoles: async (email, selectedRoles) => {
    const response = await api.put(`/api/user-profile/${email}/roles`, {
      selectedRoles,
    });
    return response.data;
  },

  deleteProfile: async (email) => {
    const response = await api.delete(`/api/user-profile/${email}`);
    return response.data;
  },
};

export default api;