import axios from "axios";
import { getAuthToken } from "../cookie";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    async (config: any) => {
        const token = await getAuthToken();
        
        if (token) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;