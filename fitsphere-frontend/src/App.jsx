import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Navbar from "./components/Navbar";
import OAuthCallback from "./pages/OAuthCallback";
import CategoryPage from "./pages/CategoryPage";
import CreateArticle from "./pages/CreateArticle";
import TagPage from "./pages/TagPage";
import EditArticle from "./pages/EditArticle";
import ArticleList from "./components/ArticleList";

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

console.log('App component rendered');

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/edit/:postId" element={<CreatePost />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/category/:category" element={<CategoryPage />} />
<Route path="/articles" element={<ArticleList />} />
            <Route path="/create-article" element={<CreateArticle />} />
            <Route path="/edit-article/:id" element={<EditArticle />} />
            <Route path="/tag/:tag" element={<TagPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
