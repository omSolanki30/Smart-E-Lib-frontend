import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}api`,
});

// Attach token automatically for authenticated requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginUser = async (email, password) => {
  const res = await API.post('/auth/login', { email, password });
  return res.data;
};

export const register = async (data) => {
  const res = await API.post('/auth/register', data);
  return res.data;
};
