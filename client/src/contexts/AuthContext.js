import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { SERVER_API, AUTH_CHECK_INTERVAL } from '../constants/constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const authSync = async () => {
    try {
      const response = await fetch(`${SERVER_API}/users/authcheck`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${SERVER_API}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      setUser(null);
      navigate('/signin');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const isLoggedIn = () => user !== null;

  useEffect(() => {
    const checkLoginStatus = async () => {
      await authSync();
      setLoaded(true);
    };

    // Initial check
    checkLoginStatus();

    // Periodic checks every 5 minutes
    const interval = setInterval(() => {
      checkLoginStatus();
    }, AUTH_CHECK_INTERVAL);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const value = { state: { user, loaded }, handlerMap: { isLoggedIn, setUser, logout } };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
