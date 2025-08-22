// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    BASE: `${API_BASE_URL}/api/auth`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    BASES: `${API_BASE_URL}/api/auth/bases`,
  },
  ASSETS: {
    BASE: `${API_BASE_URL}/api/assets`,
    DASHBOARD: `${API_BASE_URL}/api/assets/dashboard`,
  },
  PURCHASES: {
    BASE: `${API_BASE_URL}/api/purchases`,
  },
  TRANSFERS: {
    BASE: `${API_BASE_URL}/api/transfers`,
  },
  ASSIGNMENTS: {
    BASE: `${API_BASE_URL}/api/assignments`,
  },
};

export default API_BASE_URL;
