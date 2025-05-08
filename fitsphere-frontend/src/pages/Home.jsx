import React, { useEffect, useState } from "react";
import { usePosts } from "../context/usePosts";
import PostCard from "../components/PostCard";
import axios from "../api/axios";
import { FaMedal } from "react-icons/fa";

const Home = () => {
  const { posts } = usePosts();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    axios.get("/users").then((res) => setSuggestedUsers(res.data)).catch(() => setSuggestedUsers([]));
    // Fetch achievements
    axios.get("/achievements").then((res) => setAchievements(res.data.slice(0, 3))).catch(() => setAchievements([]));
  }, []);

  if (!Array.isArray(posts)) {
    return <div>Error: Posts data is not an array.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row items-start w-full max-w-7xl mx-auto justify-center gap-8">
      {/* Left Sidebar: Achievements */}
      <aside className="hidden md:block w-64 bg-white rounded-lg shadow p-4 h-fit sticky top-24 self-start">
        {/* Achievements Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-yellow-600">Recent Achievements</h3>
          {achievements.length === 0 ? (
            <p className="text-sm text-gray-500">No achievements yet</p>
          ) : (
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start gap-3 bg-yellow-50 p-3 rounded-lg">
                  <FaMedal className="text-yellow-500 text-xl flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{achievement.title}</p>
                    {achievement.userReflection && (
                      <p className="text-xs text-gray-600 mt-1 italic">"{achievement.userReflection}"</p>
                    )}
                  </div>
                </div>
              ))}
              <a href="/achievements" className="text-sm text-blue-600 hover:underline block text-center">
                View All Achievements
              </a>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="w-full max-w-xl">
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No posts found.
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {/* Right Sidebar - Friend Suggestions */}
      <aside className="hidden md:block w-72 bg-white rounded-lg shadow p-4 h-fit sticky top-24 self-start ml-auto">
        <h3 className="text-lg font-bold mb-4 text-blue-700">
          Friend Suggestions
        </h3>
        <ul className="space-y-4">
          {suggestedUsers.map((u) => (
            <li key={u.id} className="flex items-center gap-3">
              <img
                src={u.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  (u.firstName || "") + " " + (u.lastName || "")
                )}&background=4f8cff&color=fff&size=40`}
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
