// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    login: '/api/login',
    auth: '/api/auth/user',
    github: {
      profile: '/api/github/profile',
      repositories: '/api/github/repositories',
      pinned: '/api/github/pinned',
      callback: '/api/github/callback',
      pin: (repoId: string) => `/api/github/repositories/${repoId}/pin`,
      refresh: '/api/github/refresh'
    },
    pdf: '/api/generate-pdf'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => `${apiConfig.baseURL}${endpoint}`; 