import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FaTrash } from 'react-icons/fa';

const ProgressUpdateList = ({ userId }) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchUpdates();
  }, [userId]);

  const fetchUpdates = async () => {
    try {
      const response = await api.get(`/progress-updates/user/${userId}`);
      setUpdates(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load progress updates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (updateId) => {
    if (!window.confirm('Are you sure you want to delete this update?')) {
      return;
    }

    try {
      await api.delete(`/progress-updates/${updateId}`);
      setUpdates(updates.filter(update => update.id !== updateId));
    } catch (err) {
      console.error('Failed to delete update:', err);
      alert('Failed to delete update');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (updates.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No progress updates yet. Start sharing your fitness journey!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {updates.map((update) => (
        <div key={update.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{update.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(update.createdAt).toLocaleString()}
              </p>
            </div>
            {user && user.id === update.user.id && (
              <button
                onClick={() => handleDelete(update.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            )}
          </div>
          <div className="mt-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
              {update.templateType}
            </span>
            <p className="text-gray-700 mt-2">{update.details}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressUpdateList; 