import React from 'react';
import { useAuth } from '../context/AuthContext';

const Achievements = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold text-gray-800">Please log in to view your achievements</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Achievements</h1>
      
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
    </div>
  );
};

export default Achievements; 