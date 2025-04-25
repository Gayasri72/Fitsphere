import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        localStorage.setItem("token", token);
        navigate("/"); // Redirect to home page after successful login
      } else {
        console.error("OAuth token not found in the URL.");
        navigate("/login"); // Redirect to login page on failure
      }
    };

    fetchToken();
  }, [navigate]);

  return <div>Processing OAuth login...</div>;
};

export default OAuthCallback;
