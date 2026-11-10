import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smarthire_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user details on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('smarthire_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          setProfile(res.data.profile);
          localStorage.setItem('smarthire_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          localStorage.removeItem('smarthire_token');
          localStorage.removeItem('smarthire_user');
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: loggedUser } = res.data;

    localStorage.setItem('smarthire_token', token);
    localStorage.setItem('smarthire_user', JSON.stringify(loggedUser));
    setUser(loggedUser);

    // Fetch full profile
    try {
      const profileRes = await api.get('/auth/me');
      setProfile(profileRes.data.profile);
    } catch (e) {
      // Profile fetch fallback
    }

    return loggedUser;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token, user: newUser } = res.data;

    localStorage.setItem('smarthire_token', token);
    localStorage.setItem('smarthire_user', JSON.stringify(newUser));
    setUser(newUser);

    try {
      const profileRes = await api.get('/auth/me');
      setProfile(profileRes.data.profile);
    } catch (e) {
      // Profile fetch fallback
    }

    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('smarthire_token');
    localStorage.removeItem('smarthire_user');
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      setProfile(res.data.profile);
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isRecruiter: user?.role === 'recruiter',
    isCandidate: user?.role === 'candidate',
    login,
    register,
    logout,
    refreshProfile,
    setProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

