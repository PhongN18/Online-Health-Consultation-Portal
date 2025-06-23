import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5232", // chỉnh lại theo backend bạn chạy
});

// Interceptor đính JWT từ localStorage
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

export default instance;
