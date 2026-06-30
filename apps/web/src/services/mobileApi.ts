import axios from 'axios';

const mobileApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `${window.location.origin}/api/v1`,
});

mobileApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('vigilador_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

mobileApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/mobile/login') {
      localStorage.removeItem('vigilador_token');
      localStorage.removeItem('vigilador_user');
      window.location.href = '/mobile/login';
    }
    return Promise.reject(error);
  },
);

export default mobileApi;
