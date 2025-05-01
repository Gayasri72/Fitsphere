import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Achievements = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Sample achievements data with progress tracking
  const achievements = [
    {
      id: 1,
      category: 'Fitness & Workout Progress',
      title: 'Workout Plan Completion',
      description: 'Complete your weekly workout plan',
      icon: '💪',
      progress: 60,
      total: 100,
      unit: 'workouts'
    },
    {
      id: 2,
      category: 'Fitness & Workout Progress',
      title: 'Strength Milestones',
      description: 'Achieve personal best in key exercises',
      icon: '🏋️',
      progress: 3,
      total: 5,
      unit: 'milestones'
    },
    {
      id: 3,
      category: 'Health & Wellness Habits',
      title: 'Sleep Quality',
      description: 'Maintain consistent sleep schedule',
      icon: '😴',
      progress: 5,
      total: 7,
      unit: 'days'
    },
    {
      id: 4,
      category: 'Health & Wellness Habits',
      title: 'Hydration Goal',
      description: 'Meet daily water intake target',
      icon: '💧',
      progress: 1.5,
      total: 2,
      unit: 'liters'
    },
    {
      id: 5,
      category: 'Skill Learning & Development',
      title: 'Yoga Mastery',
      description: 'Learn and perfect new yoga poses',
      icon: '🧘‍♀️',
      progress: 8,
      total: 10,
      unit: 'poses'
    },
    {
      id: 6,
      category: 'Skill Learning & Development',
      title: 'Training Techniques',
      description: 'Master new workout techniques',
      icon: '🎯',
      progress: 4,
      total: 6,
      unit: 'techniques'
    }
  ];

  // Group achievements by category
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Achievements</h1>
          <button
            onClick={() => navigate('/achievements/add')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <span>+</span>
            Add Progress Update
          </button>
        </div>
        
        {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{achievement.title}</h3>
                      <p className="text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{achievement.progress} / {achievement.total} {achievement.unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements; 