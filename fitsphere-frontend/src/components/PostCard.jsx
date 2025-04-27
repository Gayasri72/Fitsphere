import React, { useState } from "react";
import { FaRegHeart, FaRegComment, FaRegShareSquare } from "react-icons/fa";
import CommentSection from "./CommentSection";

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="mx-auto w-full max-w-xl bg-white shadow-lg rounded-2xl mb-8 transition-transform hover:-translate-y-1 hover:shadow-2xl border border-gray-100">
      <div className="flex items-center p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
        <img
          src={
            "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(
              post.user
                ? `${post.user.firstName} ${post.user.lastName}`
                : "User"
            ) +
            "&background=4f8cff&color=fff&size=40"
          }
          alt="User Avatar"
          className="w-12 h-12 rounded-full mr-4 border-2 border-blue-200 shadow-sm"
        />
        <div>
          <p className="font-bold text-gray-800 text-lg">
            {post.user
              ? `${post.user.firstName} ${post.user.lastName}`
              : "User Name"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
          </p>
        </div>
      </div>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full max-h-96 object-cover"
        />
      )}
      {post.videoUrl && (
        <video controls className="w-full max-h-96 object-cover">
          <source src={post.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="p-6">
        <p className="text-gray-900 text-base mb-4 leading-relaxed">
          {post.description}
        </p>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <button className="flex items-center space-x-2 text-gray-500 hover:text-pink-500 transition-colors">
            <FaRegHeart />
            <span>Like</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <FaRegComment />
            <span>Comment</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
            <FaRegShareSquare />
            <span>Share</span>
          </button>
        </div>
        {showComments && (
          <div className="mt-4">
            <CommentSection postId={post.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
