import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { PostsProvider } from "./context/PostsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <PostsProvider>
        <App />
      </PostsProvider>
    </AuthProvider>
  </React.StrictMode>
);

