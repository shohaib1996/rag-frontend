import axios from "axios";

const api = axios.create({
  baseURL: "https://rag-project-production-71a0.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the token
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

// Add a response interceptor to handle errors (optional but good practice)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., clear token and redirect)
      // We'll let the AuthContext handle the redirection for now
      // but we could clear the token here.
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;
