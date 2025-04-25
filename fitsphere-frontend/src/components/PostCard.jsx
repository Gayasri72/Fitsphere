import React from "react";

const PostCard = ({ post }) => {
  return (
    <div className="bg-white shadow rounded-lg mb-4">
      <div className="flex items-center p-4 border-b">
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold text-gray-800">
            {post.user?.name || "User Name"}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post" className="w-full" />
      )}
      {post.videoUrl && (
        <video controls className="w-full">
          <source src={post.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="p-4">
        <p className="text-gray-800 mb-2">{post.description}</p>
        <div className="flex justify-between text-gray-500 text-sm">
          <button className="hover:text-blue-500">Like</button>
          <button className="hover:text-blue-500">Comment</button>
          <button className="hover:text-blue-500">Share</button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
