import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadUserFromLocalStorage = async () => {
      try {
        const rawUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (rawUser && rawUser !== 'undefined' && storedToken) {
          const parsedUser = JSON.parse(rawUser);

          // Fetch latest data from backend
          const res = await axios.get(`http://localhost:5000/api/users/${parsedUser._id}`);
          const freshUser = res.data;

          setUser(freshUser);
          setToken(storedToken);

          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(freshUser));
        } else {
          // Invalid or missing user/token
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('❌ Error loading or refreshing user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    };

    loadUserFromLocalStorage();
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
