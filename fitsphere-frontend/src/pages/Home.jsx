import React from "react";
import { usePosts } from "../context/usePosts";
import PostCard from "../components/PostCard";

const Home = () => {
  const { posts } = usePosts();

  if (!Array.isArray(posts)) {
    return <div>Error: Posts data is not an array.</div>;
  }

  return (
    <div>
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No posts found.</div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
};

export default Home;
