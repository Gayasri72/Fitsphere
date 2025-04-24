import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import PostCard from "../components/PostCard";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios.get(`/users/${userId}`, config)
      .then(res => setUser(res.data))
      .catch(err => console.error("Failed to fetch user info", err));

    axios.get(`/posts/user/${userId}`, config)
      .then(res => setPosts(res.data))
      .catch(err => console.error("Failed to fetch user posts", err));
  }, [userId]);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="mb-6 p-6 bg-white shadow rounded-xl text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-1">{user.firstName} {user.lastName}</h2>
        <p className="text-gray-600 text-sm">{user.email}</p>
      </div>

      <h3 className="text-xl font-semibold mb-4 text-gray-800">Their Posts:</h3>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
};

export default Profile;
