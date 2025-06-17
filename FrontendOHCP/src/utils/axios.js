import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5232/', // Replace with your API's base URL
    headers: {
        'Content-Type': 'application/json',
    }
});

// Attach token from localStorage (or sessionStorage)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
