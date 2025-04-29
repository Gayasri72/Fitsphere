import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { FaDumbbell, FaTrophy, FaBullseye, FaChevronRight } from 'react-icons/fa';


import ProgressUpdateForm from '../components/ProgressUpdateForm';
import ProgressUpdateList from '../components/ProgressUpdateList';

const Achievements = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('achievements');

  if (!user) {
    return (
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold text-gray-800">Please log in to view your achievements</h2>
      </div>
    );
  }


  const handleNewUpdate = (newUpdate) => {
    // This will be handled by the ProgressUpdateList component
    console.log('New update created:', newUpdate);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'achievements'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'progress'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('progress')}
          >
            Progress Updates
          </button>

        </div>
      </div>

      {activeTab === 'achievements' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Achievement Card 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">First Post</h3>
            <p className="text-gray-600">Create your first post on FitSphere</p>
          </div>

          {/* Achievement Card 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="text-4xl mb-4">💪</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Fitness Enthusiast</h3>
            <p className="text-gray-600">Share 5 fitness-related posts</p>
          </div>

          {/* Achievement Card 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Community Builder</h3>
            <p className="text-gray-600">Comment on 10 different posts</p>
          </div>

          {/* Achievement Card 4 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Rising Star</h3>
            <p className="text-gray-600">Get 50 likes on your posts</p>
          </div>

          {/* Achievement Card 5 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Goal Setter</h3>
            <p className="text-gray-600">Set and complete 3 fitness goals</p>
          </div>

          {/* Achievement Card 6 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Social Butterfly</h3>
            <p className="text-gray-600">Connect with 10 other users</p>
          </div>
        </div>
      ) : (
        <div>
          <ProgressUpdateForm onUpdate={handleNewUpdate} />
          <ProgressUpdateList userId={user.id} />
        </div>
      )}
    </div>
  );
};

export default Achievements; 