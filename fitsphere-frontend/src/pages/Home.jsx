import React, { useEffect, useState } from "react";
import { usePosts } from "../context/usePosts";
import PostCard from "../components/PostCard";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { posts } = usePosts();
  const { user } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    axios
      .get("/users")
      .then((res) => setSuggestedUsers(res.data))
      .catch(() => setSuggestedUsers([]));
  }, []);

  if (!Array.isArray(posts)) {
    return <div>Error: Posts data is not an array.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row items-start w-full max-w-7xl mx-auto justify-center gap-8">
      {/* Left Sidebar: Recent Activity & Explore */}
      <aside className="hidden md:block w-64 bg-white rounded-lg shadow p-4 h-fit sticky top-24 self-start">
        {/* Recent Activity */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-blue-700">
            Recent Activity
          </h3>
          <ul className="space-y-3">
            {[1, 2, 3].map((idx) => (
              <li key={idx} className="flex items-center gap-3">
                <span className="w-3 h-3 bg-green-400 rounded-full inline-block"></span>
                <span className="text-sm text-gray-700">
                  User{idx} liked a post
                </span>
              </li>
            ))}
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-blue-400 rounded-full inline-block"></span>
              <span className="text-sm text-gray-700">User4 commented</span>
            </li>
          </ul>
        </div>
        {/* Explore */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-indigo-700">Explore</h3>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-blue-600 hover:underline text-sm">
                #Fitness
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline text-sm">
                #Nutrition
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline text-sm">
                #Wellness
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline text-sm">
                #Yoga
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline text-sm">
                #Running
              </a>
            </li>
          </ul>
        </div>
      </aside>
      {/* Main Content: Stories + Posts */}
      <div className="flex flex-col items-center w-full max-w-xl">
        {/* Stories Section */}
        <div
          className="flex items-center gap-4 p-4 bg-white rounded-lg shadow mb-6 w-full justify-start"
          style={{ scrollbarWidth: "none" }}
        >
          {[1, 2, 3, 4, 5, 6].map((story, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[80px]">
              <div className="w-16 h-16 rounded-full border-4 border-blue-500 overflow-hidden mb-2">
                <img
                  src={`https://randomuser.me/api/portraits/men/${
                    idx + 10
                  }.jpg`}
                  alt="User Story"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 truncate w-16 text-center">
                User {idx + 1}
              </span>
            </div>
          ))}
          {/* Add Story Button */}
          <div className="flex flex-col items-center min-w-[80px]">
            <button className="w-16 h-16 rounded-full bg-blue-100 border-4 border-blue-500 flex items-center justify-center text-blue-600 text-3xl mb-2 hover:bg-blue-200 transition">
              +
            </button>
            <span className="text-xs font-semibold text-gray-700 truncate w-16 text-center">
              Add Story
            </span>
          </div>
        </div>
        {/* Posts Section */}
        <div className="w-full">
          {posts.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              No posts found.
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
      {/* Friend Suggestions - Right Side (real users) */}
      <aside className="hidden md:block w-72 bg-white rounded-lg shadow p-4 h-fit sticky top-24 self-start ml-auto">
        <h3 className="text-lg font-bold mb-4 text-blue-700">
          Friend Suggestions
        </h3>
        <ul className="space-y-4">
          {suggestedUsers.length === 0 && (
            <li className="text-gray-400 text-sm">No users found.</li>
          )}
          {suggestedUsers.map((u) => (
            <li key={u.id} className="flex items-center gap-3">
              <img
                src={
                  u.profileImageUrl && u.profileImageUrl !== ""
                    ? u.profileImageUrl.startsWith("/images/")
                      ? `http://localhost:8081${u.profileImageUrl}`
                      : u.profileImageUrl
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        (u.firstName || "") + " " + (u.lastName || "")
                      )}&background=4f8cff&color=fff&size=40`
                }
                alt="Suggested Friend"
                className="w-10 h-10 rounded-full border-2 border-blue-200"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">
                  {u.firstName} {u.lastName}
                </p>
                <button className="text-xs bg-blue-500 text-white rounded px-3 py-1 mt-1 hover:bg-blue-600 transition">
                  Add Friend
                </button>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Home;
