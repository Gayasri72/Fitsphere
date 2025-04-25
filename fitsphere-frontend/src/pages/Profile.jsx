import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import PostCard from "../components/PostCard";

const Profile = () => {
  const { user, logout } = useAuth();
  const [updatedUser, setUpdatedUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      setUpdatedUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });

      const fetchPosts = async () => {
        try {
          const response = await axios.get(`/posts/user/${user.id}`);
          setPosts(response.data);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

      fetchPosts();
    } else {
      console.warn("User ID is undefined. Skipping fetchPosts.");
    }
  }, [user]);

  const handleUpdate = async () => {
    console.log("Updating profile for user ID:", user.id);
    console.log("Updated user data:", updatedUser);
    try {
      await axios.put(`/users/${user.id}`, updatedUser);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    console.log("Deleting account for user ID:", user.id);
    try {
      await axios.delete(`/users/${user.id}`);
      alert("Account deleted successfully");
      logout();
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account");
    }
  };

  const handlePostDelete = async (postId) => {
    try {
      await axios.delete(`/posts/${postId}`);
      setPosts(posts.filter((post) => post.id !== postId));
      alert("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Fallback for undefined user
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 pb-16">
      <div className="mb-6 p-6 bg-white shadow rounded-xl text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-1">Profile</h2>
        <input
          type="text"
          value={updatedUser.firstName}
          onChange={(e) =>
            setUpdatedUser({ ...updatedUser, firstName: e.target.value })
          }
          placeholder="First Name"
          className="block w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          value={updatedUser.lastName}
          onChange={(e) =>
            setUpdatedUser({ ...updatedUser, lastName: e.target.value })
          }
          placeholder="Last Name"
          className="block w-full p-2 border rounded mb-2"
        />
        <input
          type="email"
          value={updatedUser.email}
          onChange={(e) =>
            setUpdatedUser({ ...updatedUser, email: e.target.value })
          }
          placeholder="Email"
          className="block w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Update Profile
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete Account
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Posts</h2>
        {posts.map((post) => (
          <div key={post.id} className="mb-4">
            <PostCard post={post} />
            <button
              onClick={() => handlePostDelete(post.id)}
              className="bg-red-500 text-white px-4 py-2 rounded mt-2"
            >
              Delete Post
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
