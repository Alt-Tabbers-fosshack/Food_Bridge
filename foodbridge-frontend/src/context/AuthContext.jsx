import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Fix: initialize from localStorage correctly
    const stored = localStorage.getItem("foodbridge_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (data) => {
    const fakeUser = {
      email: data.email,
      role: data.role,
      token: "fake-jwt-token"
    };
    localStorage.setItem("foodbridge_user", JSON.stringify(fakeUser));
    setUser(fakeUser);
  };

  const logout = () => {
    localStorage.removeItem("foodbridge_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
