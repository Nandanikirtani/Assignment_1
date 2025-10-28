import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const loginUser = async ({ email, password }) => {
  const { data } = await API.post("/auth/login", { email, password });
  return data;
};

export const registerUser = async ({ fullName, email, password }) => {
  const { data } = await API.post("/auth/register", { fullName, email, password });
  return data;
};
