import api from "../api";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Set the token in the API headers
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          const response = await api.get("/auth/verify");
          if (response.data.success) {
            setUser(response.data.employee);
          } else {
            setUser(null);
            localStorage.removeItem("token");
            delete api.defaults.headers.common["Authorization"];
          }
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        setUser(null);
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (newUser, token) => {
    setUser(newUser);
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isEmployee: user?.role === "employee",
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useAuth = () => useContext(UserContext);
export default AuthProvider;
