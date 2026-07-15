import axios from 'axios';
import { getToken, clearSession } from './auth.js';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// If the token is expired or invalid, clear the session and send the user
// back to the login screen instead of failing silently.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && window.location.pathname !== '/login') {
            clearSession();
            window.location.assign('/login');
        }
        return Promise.reject(error);
    }
);

export default api;
