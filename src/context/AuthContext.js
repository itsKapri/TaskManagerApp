// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('Authorization');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.log('Error checking login status:', err);
        await AsyncStorage.removeItem('Authorization');
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Register user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${API_URL}/auth/signup`,
        { name, email, password }
      );
    
      const { token } = response.data;

      await AsyncStorage.setItem('Authorization', token);
    
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      console.log("email", email, "password", password);
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });      
      const { token } = response.data;
      await AsyncStorage.setItem('Authorization', token);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Remove token
      await AsyncStorage.removeItem('Authorization');
      
      // Clear axios headers
      delete axios.defaults.headers.common['Authorization'];
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.log('Error logging out:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};