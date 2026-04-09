/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const AUTH_STORAGE = {
  token: "token",
  user: "user",
};

const getStoredAuth = () => {
  const sessionToken = sessionStorage.getItem(AUTH_STORAGE.token);
  const sessionUser = sessionStorage.getItem(AUTH_STORAGE.user);

  if (sessionToken || sessionUser) {
    return {
      token: sessionToken,
      user: sessionUser,
    };
  }

  const localToken = localStorage.getItem(AUTH_STORAGE.token);
  const localUser = localStorage.getItem(AUTH_STORAGE.user);

  if (localToken || localUser) {
    if (localToken) {
      sessionStorage.setItem(AUTH_STORAGE.token, localToken);
    }
    if (localUser) {
      sessionStorage.setItem(AUTH_STORAGE.user, localUser);
    }
    localStorage.removeItem(AUTH_STORAGE.token);
    localStorage.removeItem(AUTH_STORAGE.user);
  }

  return {
    token: localToken,
    user: localUser,
  };
};

export const AuthProvider = ({ children }) => {
  const storedAuth = getStoredAuth();

  const [user, setUser] = useState(() => {
    const storedUser = storedAuth.user;

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      sessionStorage.removeItem(AUTH_STORAGE.user);
      return null;
    }
  });
  const [token, setToken] = useState(() => storedAuth.token);
  const [loading] = useState(false);
  const navigate = useNavigate();

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    sessionStorage.setItem(AUTH_STORAGE.token, userToken);
    sessionStorage.setItem(AUTH_STORAGE.user, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem(AUTH_STORAGE.token);
    sessionStorage.removeItem(AUTH_STORAGE.user);
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
