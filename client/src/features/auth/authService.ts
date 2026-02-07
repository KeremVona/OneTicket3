import axios from "axios";
import type { RegisterPayload, AuthResponse, LoginPayload } from "./authSlice";

const API_URL = "http://localhost:5000/api/auth/";

const register = async (userData: RegisterPayload): Promise<AuthResponse> => {
  const response = await axios.post(API_URL + "register", userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData: LoginPayload): Promise<AuthResponse> => {
  const response = await axios.post(API_URL + "login", userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
