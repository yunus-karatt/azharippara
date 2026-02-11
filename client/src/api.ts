import axios from 'axios';

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return url.endsWith('/api') ? url : `${url}/api`;
};

const API = axios.create({
  baseURL: getBaseURL(),
});


API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
