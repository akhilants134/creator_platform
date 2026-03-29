/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const getInitialAuthState = () => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!storedToken || !storedUser) {
    // Keep storage consistent if one value is missing.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { user: null, token: null };
  }

  try {
    return { user: JSON.parse(storedUser), token: storedToken };
  } catch (error) {
    console.error("Error parsing stored user data:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [initialAuthState] = useState(getInitialAuthState);
  const [user, setUser] = useState(initialAuthState.user);
  const [token, setToken] = useState(initialAuthState.token);
  const [loading] = useState(false);
  const navigate = useNavigate();

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isAuthenticated = () => Boolean(token && user);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
