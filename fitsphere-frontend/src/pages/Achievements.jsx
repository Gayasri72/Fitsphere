import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Achievements = () => {
  const { user } = useAuth();
  const [progressUpdates, setProgressUpdates] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetchProgressUpdates();
    }
  }, [user]);

  const fetchProgressUpdates = async () => {
    try {
      const response = await axios.get(`/api/progress-updates/user/${user.id}`);
      setProgressUpdates(response.data);
    } catch (error) {
      console.error('Error fetching progress updates:', error);
    }
  };

  const templates = [
    {
      type: 'WORKOUT_COMPLETED',
      title: 'Completed a workout session',
      icon: '💪',
      description: 'Track your workout sessions and share your progress'
    },
    {
      type: 'PERSONAL_BEST',
      title: 'Achieved a new personal best',
      icon: '🏆',
      description: 'Celebrate your achievements and milestones'
    },
    {
      type: 'NEW_TECHNIQUE',
      title: 'Learned a new exercise technique',
      icon: '🎯',
      description: 'Document your learning journey and skill development'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Progress Updates Preview */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Your Progress Updates</h2>
            <Link
              to="/progress-updates"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View All Updates
            </Link>
          </div>
          
          {progressUpdates.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <p className="text-gray-600 text-center">No progress updates yet.</p>
              <Link
                to="/progress-updates"
                className="block text-center mt-4 text-blue-600 hover:text-blue-800"
              >
                Create your first update
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {progressUpdates.slice(0, 3).map((update) => {
                const template = templates.find(t => t.type === update.templateType);
                return (
                  <div
                    key={update.id}
                    className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{template?.icon || '📝'}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {update.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(update.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700 mt-2 line-clamp-2">
                          {update.details}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Achievements</h2>
          <div className="grid grid-cols-1 gap-4">
            {templates.map((template) => (
              <div
                key={template.type}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{template.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {template.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{template.description}</p>
                    <div className="mt-3">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements; 