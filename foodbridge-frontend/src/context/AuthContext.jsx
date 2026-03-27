import { createContext, useState, useContext, useEffect } from "react";
import { login as apiLogin, register as apiRegister, getCurrentUser, logout as apiLogout } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem("foodbridge_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Verify token on mount
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (token && !user) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          localStorage.setItem("foodbridge_user", JSON.stringify(userData));
        } catch (err) {
          // Token invalid, clear storage
          localStorage.clear();
          setUser(null);
        }
      }
    };
    verifyUser();
  }, [user]);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const { user: userData } = await apiLogin(username, password);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.detail || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, password2, role) => {
    setLoading(true);
    setError(null);
    try {
      const { user: userData } = await apiRegister(username, email, password, password2, role);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.detail || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);