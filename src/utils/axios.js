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
    const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
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
    const status = error.response?.status;
    const hadToken = !!(localStorage.getItem('authToken') || localStorage.getItem('adminToken'));

    if ((status === 401 || status === 403) && hadToken) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');

      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = status === 403 ? '/login?forbidden=admin' : '/login?redirect=/admin';
      }
    }

    return Promise.reject(error);
  }
);

export default api;