import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login: authLogin, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/public/login", { email, password });
      console.log("Login successful", response.data);
      const token = response.data.token;
      console.log("Token received from login response:", token); // Debugging log
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      authLogin(token); // Update AuthContext and trigger navbar refresh
      navigate("/"); // Redirect to home after successful login
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login error:", err); // Log the error for debugging
    }
  };

  const handleOAuthLogin = (provider) => {
    if (provider === "google") {
      window.location.href = `http://localhost:8081/oauth2/authorization/google`;
    } else {
      window.location.href = `http://localhost:8081/oauth2/authorization/${provider}`;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-tight drop-shadow">
          Login to FitSphere
        </h2>
        {error && (
          <p className="text-red-500 mb-4 text-center font-medium">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none bg-blue-50 text-gray-800"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none bg-indigo-50 text-gray-800"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:from-blue-600 hover:to-indigo-600 transition"
          >
            Login
          </button>
        </form>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => handleOAuthLogin("google")}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <g>
                <path
                  fill="#4285F4"
                  d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.67 28.29c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C.7 16.18 0 19.99 0 24c0 4.01.7 7.82 2.69 12.24l7.98-6.2z"
                />
                <path
                  fill="#EA4335"
                  d="M24 48c6.18 0 11.64-2.04 15.53-5.56l-7.19-5.6c-2.01 1.35-4.59 2.16-8.34 2.16-6.38 0-11.87-3.63-14.33-8.79l-7.98 6.2C6.73 42.18 14.82 48 24 48z"
                />
              </g>
            </svg>
            Login with Google
          </button>
          <button
            onClick={() => handleOAuthLogin("github")}
            className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-lg font-semibold shadow hover:bg-gray-900 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .267.18.577.688.479C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"
              />
            </svg>
            Login with GitHub
          </button>
        </div>
        <p className="mt-6 text-sm text-gray-600 text-center">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Sign up
          </a>
        </p>
        <p className="text-sm text-gray-600 text-center mt-2">
          <a
            href="/forgot-password"
            className="text-indigo-600 hover:underline font-semibold"
          >
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
