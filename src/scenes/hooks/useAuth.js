// src/hooks/useAuth.js
import { useNavigate } from "react-router-dom";
import { appConfig } from "../../config/appConfig";

export const useAuth = () => {
  const navigate = useNavigate();

  const login = (token) => {
    sessionStorage.setItem("token", token);
    navigate("/", { replace: true });
  };

  const logout = () => {
    sessionStorage.clear();
    navigate(appConfig.api.auth.login, { replace: true });
  };

  return {
    login,
    logout,
    isAuthenticated: !!sessionStorage.getItem("token"),
  };
};
