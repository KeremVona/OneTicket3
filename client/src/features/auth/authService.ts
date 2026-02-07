import API from "../../api/api";
import type { RegisterPayload, AuthResponse, LoginPayload } from "../../b/b1";

const register = async (userData: RegisterPayload): Promise<AuthResponse> => {
  const response = await API.post("/auth/register", userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData: LoginPayload): Promise<AuthResponse> => {
  const response = await API.post("/auth/login", userData);
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
