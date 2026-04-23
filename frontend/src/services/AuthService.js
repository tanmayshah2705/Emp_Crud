import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api') + '/auth';

export const login = (credentials) => axios.post(`${API_URL}/login`, credentials);
export const signup = (admin) => axios.post(`${API_URL}/signup`, admin);

export const logout = () => {
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};
