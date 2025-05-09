import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FaMedal, FaEdit, FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const SharedAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editReflection, setEditReflection] = useState('');
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchAchievements();
  }, [location.pathname]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/achievements');
      setAchievements(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError('Failed to load achievements. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (achievement) => {
    setEditingId(achievement.id);
    setEditReflection(achievement.userReflection || '');
  };

  const handleUpdateReflection = async (achievementId) => {
    if (!editReflection.trim()) {
      alert('Please enter a reflection before saving.');
      return;
    }

    try {
      await api.put(`/achievements/${achievementId}`, {
        userReflection: editReflection.trim()
      });
      
      // Update the local state immediately for better UX
      setAchievements(achievements.map(achievement => 
        achievement.id === achievementId 
          ? { ...achievement, userReflection: editReflection.trim() }
          : achievement
      ));
      
      setEditingId(null);
      setEditReflection('');
      alert('Reflection updated successfully!');
    } catch (error) {
      console.error('Error updating reflection:', error);
      alert('Failed to update reflection');
    }
  };

  const handleDeleteAchievement = async (achievementId) => {
    if (!window.confirm('Are you sure you want to delete this achievement? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/achievements/${achievementId}`);
      // Update local state immediately
      setAchievements(achievements.filter(a => a.id !== achievementId));
      alert('Achievement deleted successfully');
    } catch (error) {
      console.error('Error deleting achievement:', error);
      alert('Failed to delete achievement');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchAchievements}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 mb-4">{success}</div>
        <button
          onClick={() => setSuccess(null)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          OK
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Community Achievements</h1>
      
      {achievements.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <FaMedal className="text-6xl mx-auto mb-4 text-gray-300" />
          <p className="mb-4">No achievements yet.</p>
          <p>Complete workouts to earn achievements!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-blue-600">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600">
                    {achievement.description}
                  </p>
                </div>
                <div className="text-3xl text-yellow-500">
                  <FaMedal />
                </div>
              </div>
              
              {editingId === achievement.id ? (
                <div className="mt-4">
                  <textarea
                    value={editReflection}
                    onChange={(e) => setEditReflection(e.target.value)}
                    className="w-full p-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Share your thoughts about this achievement..."
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateReflection(achievement.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                achievement.userReflection && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-700 italic">
                      "{achievement.userReflection}"
                    </p>
                  </div>
                )
              )}
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Achieved by {achievement.user?.firstName} {achievement.user?.lastName}
                  <br />
                  {new Date(achievement.createdAt).toLocaleDateString()}
                </div>
                
                <div className="flex gap-2">
                  {user && user.id === achievement.user?.id && (
                    <>
                      <button
                        onClick={() => handleEditClick(achievement)}
                        className="text-blue-500 hover:text-blue-700 transition"
                        title="Edit reflection"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteAchievement(achievement.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete achievement"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedAchievements;