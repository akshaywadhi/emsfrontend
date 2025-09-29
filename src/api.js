import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:5000/api",
  baseURL: "https://emsbackend-gizp.onrender.com/",
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  console.log("Request headers:", config.headers);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
