import React, { useState, useEffect } from "react";
import { FaRegHeart, FaHeart, FaRegComment, FaRegShareSquare } from "react-icons/fa";
import CommentSection from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Initialize like state from post data
  useEffect(() => {
    if (user && post.likedBy) {
      const userLiked = post.likedBy.some(likedUser => likedUser.id === user.id);
      setIsLiked(userLiked);
      setLikeCount(post.likedBy.length);
    }
  }, [user, post.likedBy]);

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like posts");
      navigate('/login');
      return;
    }

    try {
      console.log('Before like - isLiked:', isLiked);
      const response = await api.put(`/posts/${post.id}/like`);
      const updatedPost = response.data;
      console.log('API Response:', updatedPost);
      
      // Toggle the like status instead of checking the response
      const newLikeStatus = !isLiked;
      setIsLiked(newLikeStatus);
      setLikeCount(prevCount => newLikeStatus ? prevCount + 1 : prevCount - 1);
      
      console.log('After like - isLiked:', newLikeStatus);
    } catch (error) {
      console.error("Error updating like status:", error);
      alert("Failed to update like status");
    }
  };

  const handleShare = async () => {
    if (!user) {
      alert("Please login to share posts");
      navigate('/login');
      return;
    }

    setIsSharing(true);
    try {
      await api.post(`/posts/${post.id}/share`);
      alert("Post shared successfully!");
    } catch (error) {
      console.error("Error sharing post:", error);
      if (error.response?.status === 403) {
        alert("You need to be logged in to share posts");
        navigate('/login');
      } else {
        alert("Failed to share post");
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl bg-white shadow-lg rounded-2xl mb-8 transition-transform hover:-translate-y-1 hover:shadow-2xl border border-gray-100">
      <div className="flex items-center p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
        <img
          src={
            post.user &&
            post.user.profileImageUrl &&
            post.user.profileImageUrl !== ""
              ? post.user.profileImageUrl
              : "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(
                  post.user
                    ? `${post.user.firstName} ${post.user.lastName}`
                    : "User"
                ) +
                "&background=4f8cff&color=fff&size=40"
          }
          alt="User Avatar"
          className="w-12 h-12 rounded-full mr-4 border-2 border-blue-200 shadow-sm"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(
                post.user
                  ? `${post.user.firstName} ${post.user.lastName}`
                  : "User"
              ) +
              "&background=4f8cff&color=fff&size=40";
          }}
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
          src={
            post.imageUrl.startsWith("/images/")
              ? `http://localhost:8081${post.imageUrl}`
              : post.imageUrl
          }
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
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
            }`}
          >
            {isLiked ? (
              <FaHeart className="text-pink-500 text-xl" />
            ) : (
              <FaRegHeart className="text-xl" />
            )}
            <span className={isLiked ? 'text-pink-500' : ''}>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
          </button>
          <button 
            onClick={() => {
              if (!user) {
                alert("Please login to comment on posts");
                navigate('/login');
                return;
              }
              setShowComments(!showComments);
            }}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <FaRegComment />
            <span>Comment</span>
          </button>
          <button 
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors disabled:opacity-50"
          >
            <FaRegShareSquare />
            <span>{isSharing ? 'Sharing...' : 'Share'}</span>
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
