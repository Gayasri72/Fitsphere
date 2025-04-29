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
        // Ensure sub is set for compatibility with UI
        if (!decoded.sub && decoded.id) decoded.sub = decoded.id;
        console.log("Decoded token payload:", decoded); // Debugging log
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
      console.log("No token found, setting user to null"); // Debugging log
      setUser(null);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    try {
      let decoded = jwtDecode(token);
      // Ensure sub is set for compatibility with UI
      if (!decoded.sub && decoded.id) decoded.sub = decoded.id;
      console.log("User logged in:", decoded); // Debugging log
      setUser(decoded);
    } catch {
      console.error("Failed to decode token during login"); // Debugging log
      setUser(null);
    }
  };

  const logout = () => {
    console.log("User logged out"); // Debugging log
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
