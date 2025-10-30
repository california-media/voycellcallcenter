import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://nf6fp9tcn6.execute-api.eu-north-1.amazonaws.com/"
    : "https://nf6fp9tcn6.execute-api.eu-north-1.amazonaws.com/";

const api = axios.create({ baseURL });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;