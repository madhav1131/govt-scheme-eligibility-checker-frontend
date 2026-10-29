import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
        fetchSavedSchemes();
      } catch (err) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const fetchSavedSchemes = async () => {
    try {
      const res = await authAPI.getSaved();
      if (res.data.success) {
        setSavedSchemes(res.data.savedSchemes);
      }
    } catch (err) {
      console.log('Error fetching saved schemes:', err.message);
    }
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      await fetchSavedSchemes();
    }
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setSavedSchemes([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const toggleBookmark = async (scheme) => {
    if (!token) return false;
    try {
      const res = await authAPI.toggleBookmark({
        schemeId: scheme._id || scheme.id,
        schemeTitle: scheme.title,
        category: scheme.category,
        benefits: scheme.benefits
      });
      if (res.data.success) {
        await fetchSavedSchemes();
        return res.data.isBookmarked;
      }
    } catch (err) {
      console.error('Bookmark toggle error:', err);
    }
    return false;
  };

  const isBookmarked = (schemeId) => {
    return savedSchemes.some(s => s.schemeId === schemeId || s.schemeId === schemeId);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      savedSchemes,
      toggleBookmark,
      isBookmarked
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
