import axios from 'axios';
import { getClientAuthToken } from '../client-cookie';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getClientAuthToken();
        if(token && config.headers){
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config; 
    },
    (error) => {
        return Promise.reject(error);
    }
)

// lib/api/axios.ts
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        console.warn('401 Unauthorized - user is not authenticated or token expired');
        // Optionally: clear auth cookies or trigger a logout
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance;