import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // The Axios interceptor returns response.data, so `response` is:
          // { success: true, message: "...", data: UserResponse, timestamp: "..." }
          const response = await api.get('/users/me');
          if (response && response.success) {
            setUser(response.data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Returns: { success: true, data: { token, role, userId, email, ... } }
      const response = await api.post('/auth/login', { email, password });

      if (response && response.success && response.data && response.data.token) {
        const { token, role, userId, email: userEmail } = response.data;
        localStorage.setItem('token', token);

        // Fetch full profile from user-service
        try {
          const profileRes = await api.get('/users/me');
          if (profileRes && profileRes.success) {
            setUser(profileRes.data);
          } else {
            // Fallback: set minimal user from auth response
            setUser({ id: userId, email: userEmail, role });
          }
        } catch (profileErr) {
          console.warn('Could not fetch profile from user-service, using auth data:', profileErr);
          // user-service may not have synced yet via Kafka — use auth data as fallback
          setUser({ id: userId, email: userEmail, role });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      // Returns: { success: true, data: { token, role, userId, email, ... } }
      const response = await api.post('/auth/register', userData);

      if (response && response.success && response.data && response.data.token) {
        const { token, role, userId, email } = response.data;
        localStorage.setItem('token', token);

        // The auth-service publishes a Kafka event to user-service.
        // Give user-service a moment to process it, then fetch profile.
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
          const profileRes = await api.get('/users/me');
          if (profileRes && profileRes.success) {
            setUser(profileRes.data);
          } else {
            setUser({ id: userId, email, role });
          }
        } catch {
          // user-service may still be processing — fallback to auth data
          setUser({ id: userId, email, role });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, hasRole, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
