import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaEdit } from "react-icons/fa";
import api from "../api/axios";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [postId]);

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
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {error && (
        <div className="p-2 text-red-500 bg-red-50 rounded-md">{error}</div>
      )}

      <div className="space-y-4">
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-white rounded-lg shadow">
              {editingComment?.id === comment.id ? (
                <form onSubmit={handleUpdate} className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {comment.user?.firstName} {comment.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {user && (user.id === comment.user?.id || user.id === comment.post?.user?.id) && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(comment)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-gray-700">{comment.content}</p>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
