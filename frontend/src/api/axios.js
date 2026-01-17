// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api', // ex: http://localhost:8000/api
  withCredentials: true,
});

// api.defaults.headers.common["Accept"] = "application/json";
// api.defaults.withCredentials = true;
// api.defaults.withXSRFToken = true;

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    try {
        const {response} = error;
        if (response && response.status === 401) {
            localStorage.removeItem('token')
        }
        return Promise.reject(error);
    } catch (err) {
        console.log(err)
    }
    
    throw error;
});

export default api;



