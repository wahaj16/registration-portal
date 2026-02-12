// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  ADMIN_SIGNUP: `${API_BASE_URL}/api/admin/signup`,
  ADMIN_VERIFY: `${API_BASE_URL}/api/admin/verify`,
  
  // Visitor endpoints
  VISITORS_REGISTER: `${API_BASE_URL}/api/visitors/register`,
  VISITORS_LIST: `${API_BASE_URL}/api/visitors`,
  VISITORS_STATS: `${API_BASE_URL}/api/visitors/stats/overview`,
  
  // Exhibitor endpoints
  EXHIBITORS_REGISTER: `${API_BASE_URL}/api/exhibitors/register`,
  EXHIBITORS_LIST: `${API_BASE_URL}/api/exhibitors`,
  EXHIBITORS_STATS: `${API_BASE_URL}/api/exhibitors/stats/overview`,
};

export default API_BASE_URL;