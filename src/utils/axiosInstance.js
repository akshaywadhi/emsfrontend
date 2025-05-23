import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://emsbackend-gizp.onrender.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

axiosInstance.interceptors.request.use(
  async (config) => {
    await delay(2000); 
    const accessToken = localStorage.getItem("token");
    console.log("Access Token (after delay):", accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
