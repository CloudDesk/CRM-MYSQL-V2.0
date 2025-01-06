// src/hooks/useAuth.js
import { useNavigate } from "react-router-dom";
import { appConfig } from "../../config/appConfig";

export const useAuth = () => {
  const authLogin = appConfig.api.auth.login;
  const navigate = useNavigate();

  const login = (token) => {
    sessionStorage.setItem("token", token);
    navigate("/", { replace: true });
  };

  const logout = () => {
    sessionStorage.clear();
    navigate(authLogin, { replace: true });
  };

  return {
    login,
    logout,
    isAuthenticated: !!sessionStorage.getItem("token"),
  };
};
