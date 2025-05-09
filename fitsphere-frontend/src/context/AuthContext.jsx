import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined means "loading"

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token retrieved from localStorage:", token);
    if (token) {
      try {
        let decoded = jwtDecode(token);
        // Ensure consistent ID field for both regular and OAuth logins
        if (!decoded.sub && decoded.id) {
          decoded.sub = decoded.id;
        }
        if (!decoded.id && decoded.sub) {
          decoded.id = decoded.sub;
        }
        console.log("Decoded token payload:", decoded);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      console.log("No token found, setting user to null");
      setUser(null);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    try {
      let decoded = jwtDecode(token);
      // Ensure consistent ID field for both regular and OAuth logins
      if (!decoded.sub && decoded.id) {
        decoded.sub = decoded.id;
      }
      if (!decoded.id && decoded.sub) {
        decoded.id = decoded.sub;
      }
      console.log("User logged in:", decoded);
      setUser(decoded);
    } catch (err) {
      console.error("Failed to decode token during login:", err);
      setUser(null);
    }
  };

  const logout = () => {
    console.log("User logged out");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
