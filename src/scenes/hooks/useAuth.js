// src/hooks/useAuth.js
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();

  const login = (token) => {
    sessionStorage.setItem("token", token);
    navigate("/", { replace: true });
  };

  const logout = () => {
    sessionStorage.clear();
    navigate("/auth/login", { replace: true });
  };

  return {
    login,
    logout,
    isAuthenticated: !!sessionStorage.getItem("token"),
  };
};
