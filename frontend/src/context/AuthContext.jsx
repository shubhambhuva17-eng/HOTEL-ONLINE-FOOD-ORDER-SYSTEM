import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('hotel_manager_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('hotel_manager_token') || null;
  });

  const login = async (email, password) => {
    const res = await api.loginManager(email, password);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('hotel_manager_user', JSON.stringify(res.user));
    localStorage.setItem('hotel_manager_token', res.token);
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hotel_manager_user');
    localStorage.removeItem('hotel_manager_token');
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
