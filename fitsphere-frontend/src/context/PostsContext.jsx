import { createContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "./AuthContext";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Initial fetch
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/posts");
      console.log("Fetched posts:", res.data); // Debugging log
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]); // Refetch when user changes

  const addPost = (post) => {
    if (!post.id) {
      post.id = Date.now(); // Fallback for missing id
      console.warn("Post missing id, assigning temporary id:", post.id);
    }
    setPosts((prev) => [post, ...prev]);
  };

  const removePost = (postId) =>
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  const updatePost = (updated) =>
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        fetchPosts,
        addPost,
        removePost,
        updatePost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export { PostsContext };
