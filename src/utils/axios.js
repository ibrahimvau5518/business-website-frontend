import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://business-website-backend-psi.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Tumi pore ekhane localStorage theke token niye auth header e add korte parbe
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer \${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Ekhane global error handling kora jabe (jsmn 401 unauthorized hole logout hoye jabe)
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized API calls or Session Expired');
    }
    return Promise.reject(error);
  }
);

export default api;
