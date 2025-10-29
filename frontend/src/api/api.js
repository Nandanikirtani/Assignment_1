import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://assignment-1-ikmo.onrender.com/api" // Render backend
      : "http://localhost:5000/api", // Local backend
  withCredentials: true,
});


// Add token to requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- AUTH ----------
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// ---------- PROFILE ----------
export const getProfile = () => API.get("/user/profile");
export const updateProfile = (data) => API.put("/user/profile", data);

// ---------- TASKS ----------
export const getTasks = (query = "") => API.get(`/tasks?q=${query}`);
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
