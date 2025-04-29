import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { FaDumbbell, FaTrophy, FaBullseye, FaChevronRight } from 'react-icons/fa';

const Achievements = () => {
  const { user } = useAuth();
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchProgressUpdates();
    }
  }, [user]);

  const fetchProgressUpdates = async () => {
    try {
      const response = await axios.get(`/progress-updates/user/${user.id}`);
      setProgressUpdates(response.data);
    } catch (error) {
      console.error('Error fetching progress updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const templates = [
    {
      type: 'WORKOUT_COMPLETED',
      title: 'Completed a workout session',
      icon: <FaDumbbell className="w-8 h-8" />,
      description: 'Track your workout sessions and share your progress',
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      bgLight: 'bg-blue-50',
      progress: progressUpdates.filter(u => u.templateType === 'WORKOUT_COMPLETED').length
    },
    {
      type: 'PERSONAL_BEST',
      title: 'Achieved a new personal best',
      icon: <FaTrophy className="w-8 h-8" />,
      description: 'Celebrate your achievements and milestones',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      bgLight: 'bg-yellow-50',
      progress: progressUpdates.filter(u => u.templateType === 'PERSONAL_BEST').length
    },
    {
      type: 'NEW_TECHNIQUE',
      title: 'Learned a new exercise technique',
      icon: <FaBullseye className="w-8 h-8" />,
      description: 'Document your learning journey and skill development',
      color: 'bg-green-500',
      textColor: 'text-green-500',
      bgLight: 'bg-green-50',
      progress: progressUpdates.filter(u => u.templateType === 'NEW_TECHNIQUE').length
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Fitness Journey</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your progress, celebrate achievements, and stay motivated on your fitness path
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {templates.map((template) => (
            <div
              key={template.type}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className={`${template.color} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="bg-white rounded-lg p-3">
                    <span className={template.textColor}>{template.icon}</span>
                  </div>
                  <span className="text-white text-3xl font-bold">{template.progress}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.title}</h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <div className={`${template.bgLight} rounded-lg p-3 flex items-center justify-between`}>
                  <span className={`${template.textColor} font-medium`}>
                    {template.progress} {template.progress === 1 ? 'time' : 'times'}
                  </span>
                  <Link
                    to="/progress-updates"
                    className={`${template.textColor} hover:opacity-75 transition-opacity`}
                  >
                    <FaChevronRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Progress Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Progress</h2>
              <p className="text-gray-600 mt-1">Your latest fitness achievements</p>
            </div>
            <Link
              to="/progress-updates"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              View All <FaChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {progressUpdates.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaDumbbell className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No progress updates yet</h3>
              <p className="text-gray-600 mb-6">Start tracking your fitness journey today!</p>
              <Link
                to="/progress-updates"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
              >
                Create Your First Update <FaChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {progressUpdates.slice(0, 3).map((update) => {
                const template = templates.find(t => t.type === update.templateType);
                return (
                  <div
                    key={update.id}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`${template?.bgLight} p-3 rounded-lg`}>
                      <span className={template?.textColor}>{template?.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{update.title}</h3>
                      <p className="text-gray-600 mt-1">{update.details}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(update.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Achievements; 