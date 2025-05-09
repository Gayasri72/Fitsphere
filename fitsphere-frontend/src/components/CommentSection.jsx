import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaEdit, FaUserCircle } from "react-icons/fa";
import { formatDistanceToNow } from 'date-fns';
import api from "../api/axios";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const { user } = useAuth();
  const textareaRef = useRef(null);
  const editTextareaRef = useRef(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const adjustTextareaHeight = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 80)}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [newComment]);

  useEffect(() => {
    if (editTextareaRef.current) {
      adjustTextareaHeight(editTextareaRef.current);
    }
  }, [editContent]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      setComments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments");
      setComments([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await api.post(`/posts/${postId}/comments`, newComment, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      setComments((prevComments) => {
        const newComment = response.data;
        return Array.isArray(prevComments)
          ? [newComment, ...prevComments]
          : [newComment];
      });
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/posts/${postId}/comments/${commentId}`);
      setComments((prevComments) =>
        Array.isArray(prevComments)
          ? prevComments.filter((comment) => comment.id !== commentId)
          : []
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment");
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      const response = await api.put(`/posts/${postId}/comments/${editingComment.id}`, editContent, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === editingComment.id ? response.data : comment
        )
      );
      setEditingComment(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
      setError("Failed to update comment");
    }
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent("");
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              adjustTextareaHeight(e.target);
            }}
            placeholder="Write a comment..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] max-h-[80px] overflow-hidden"
            rows="1"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="p-2 text-sm text-red-500 bg-red-50 rounded-lg">{error}</div>
      )}

      <div className="space-y-4">
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                {comment.user?.profileImageUrl ? (
                  <img
                    src={comment.user.profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {comment.user?.firstName} {comment.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {user && (user.id === comment.user?.id || user.id === comment.post?.user?.id) && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(comment)}
                          className="text-gray-500 hover:text-blue-500"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  {editingComment?.id === comment.id ? (
                    <form onSubmit={handleUpdate} className="mt-2">
                      <textarea
                        ref={editTextareaRef}
                        value={editContent}
                        onChange={(e) => {
                          setEditContent(e.target.value);
                          adjustTextareaHeight(e.target);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] max-h-[80px] overflow-hidden"
                        rows="1"
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                        >
                          Update
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="mt-1 text-gray-700">{comment.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
