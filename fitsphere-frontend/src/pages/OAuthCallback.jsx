import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      login(token); // This will update user
    } else {
      console.error("OAuth token not found in the URL.");
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return <div>Processing OAuth login...</div>;
};

export default OAuthCallback;
