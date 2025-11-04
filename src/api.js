import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:5000/api",
  baseURL: "https://emsbackend-gizp.onrender.com/api",
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
  
    return response;
  },
  (error) => {

    return Promise.reject(error);
  }
);

export default api;
