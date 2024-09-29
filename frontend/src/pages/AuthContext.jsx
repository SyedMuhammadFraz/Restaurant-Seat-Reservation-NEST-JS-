// AuthContext.js
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");

  const login = (id) => {
    setIsAuthenticated(true);
    setUserId(id);
  };
  const logout = () => {
    setIsAuthenticated(false);;
    setUserId(null)
  };

  return (
    <AuthContext.Provider value={{ userId, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
