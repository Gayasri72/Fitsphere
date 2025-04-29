import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined means "loading"

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        let decoded = jwtDecode(token);
        // Ensure sub is set for compatibility with UI
        if (!decoded.sub && decoded.id) decoded.sub = decoded.id;
        if (!decoded.id) {
          console.warn("Decoded token does not contain an ID field.");
        }
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    try {
      let decoded = jwtDecode(token);
      // Ensure sub is set for compatibility with UI
      if (!decoded.sub && decoded.id) decoded.sub = decoded.id;
      setUser(decoded);
    } catch {
      console.error("Failed to decode token during login");
      setUser(null);
    }
  };

  const logout = () => {
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
