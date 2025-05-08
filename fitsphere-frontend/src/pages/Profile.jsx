import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import PostCard from "../components/PostCard";
import { FaEdit, FaTrash } from "react-icons/fa";

const Profile = () => {
  const { user, logout } = useAuth();
  const [updatedUser, setUpdatedUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [profileImage, setProfileImage] = useState(null);

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

  const handleProfileImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("firstName", updatedUser.firstName);
      formData.append("lastName", updatedUser.lastName);
      formData.append("email", updatedUser.email);
      if (profileImage) formData.append("profileImage", profileImage);
      await axios.put(`/users/${user.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Re-login to get a fresh token and user context
      const loginResponse = await axios.post("/public/login", {
        email: updatedUser.email,
        password: prompt("Please enter your password to re-authenticate:"),
      });
      const token = loginResponse.data.token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      window.location.reload(); // Reload to refresh context and UI
    } catch (error) {
      alert("Failed to update profile. Please check your credentials.");
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

  const handlePostEdit = (post) => {
    setEditingPostId(post.id);
    setEditDescription(post.description);
  };

  const handlePostUpdate = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/posts/${postId}`,
        { description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, description: editDescription } : p
        )
      );
      setEditingPostId(null);
      setEditDescription("");
      alert("Post updated successfully");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Fallback for undefined user
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 pb-16">
      {/* Profile Card */}
      <div className="flex flex-col sm:flex-row items-center bg-white shadow-lg rounded-2xl p-8 mb-8">
        <div className="flex flex-col items-center mb-4">
          <img
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : user.profileImageUrl && user.profileImageUrl !== ""
                ? user.profileImageUrl
                : "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(
                    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                      "User"
                  ) +
                  "&background=4f8cff&color=fff&size=128"
            }
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-blue-200 shadow-lg mb-2"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(
                  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                    "User"
                ) +
                "&background=4f8cff&color=fff&size=128";
            }}
          />
          <label className="cursor-pointer bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
            />
          </label>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-blue-700 mb-1">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-500 mb-2">{user.email}</p>
          <div className="flex justify-center sm:justify-start gap-8 mb-4">
            <div>
              <span className="font-bold text-lg">{posts.length}</span>
              <span className="text-gray-500 ml-1">Posts</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={updatedUser.firstName}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, firstName: e.target.value })
              }
              placeholder="First Name"
              className="p-2 border rounded mb-2 sm:mb-0"
            />
            <input
              type="text"
              value={updatedUser.lastName}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, lastName: e.target.value })
              }
              placeholder="Last Name"
              className="p-2 border rounded mb-2 sm:mb-0"
            />
            <input
              type="email"
              value={updatedUser.email}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, email: e.target.value })
              }
              placeholder="Email"
              className="p-2 border rounded mb-2 sm:mb-0"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 justify-center">
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      {/* Posts Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Posts</h2>
        {posts.length === 0 ? (
          <div className="text-center text-gray-400">No posts yet.</div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post) => (
              <div key={post.id} className="relative">
                {editingPostId === post.id ? (
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <textarea
                      className="w-full border rounded p-2 mb-2"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePostUpdate(post.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPostId(null)}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <PostCard post={post} />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => handlePostEdit(post)}
                        className="bg-yellow-400 text-white p-2 rounded-full hover:bg-yellow-500 transition flex items-center justify-center"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handlePostDelete(post.id)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition flex items-center justify-center"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
