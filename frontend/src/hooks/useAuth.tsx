import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import type { User, AuthContextType } from '../types';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('worldcraft_token');
    const storedUser = localStorage.getItem('worldcraft_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      localStorage.setItem('worldcraft_token', token);
      localStorage.setItem('worldcraft_user', JSON.stringify(user));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { email, username, password });
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      localStorage.setItem('worldcraft_token', token);
      localStorage.setItem('worldcraft_user', JSON.stringify(user));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('worldcraft_token');
    localStorage.removeItem('worldcraft_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
