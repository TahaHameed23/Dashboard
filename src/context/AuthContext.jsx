/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from "react";
import { account } from "../services/appwrite.config";
import { Navigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const excludedRoutes = ["/login", "/login/reset-password", "/signup"];

  useEffect(() => {
    if (excludedRoutes.includes(window.location.pathname)) {
      setLoading(false);
      return;
    }
    const checkSession = async () => {
      try {
        const session = await account.get();
        setUser(session);
      } catch {
        setUser(null);
        <Navigate to={"/login"} />;
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
