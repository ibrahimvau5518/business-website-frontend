import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const hadAdminToken = !!localStorage.getItem('adminToken');

    if ((status === 401 || status === 403) && hadAdminToken) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');

      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login?redirect=/admin';
      }
    }

    return Promise.reject(error);
  }
);

export default api;