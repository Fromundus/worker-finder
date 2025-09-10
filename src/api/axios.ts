import ipconfig from '@/ipconfig';
import { useAuth } from '@/store/auth';
import axios from 'axios';

const api = axios.create({
  baseURL: `${ipconfig}/api`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth-storage');
  if (raw) {
    const { state } = JSON.parse(raw);
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    useAuth.getState().updateConnection(true); 
    return response;
  },
  (error) => {
    const status = error?.response?.status;

    if(error.message === "Network Error"){
      useAuth.getState().updateConnection(false); 
    }

    if (status === 401 || status === 403) {
      localStorage.removeItem('auth-storage');
      // Optional: redirect to login
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default api;
