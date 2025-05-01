import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AddProgressUpdate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedAchievement, setSelectedAchievement] = useState('');
  const [progress, setProgress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const achievementTemplates = [
    {
      id: 'workout_completion',
      title: 'Workout Plan Completion',
      description: 'Track your workout completion progress',
      unit: 'workouts',
      icon: '💪'
    },
    {
      id: 'strength_milestone',
      title: 'Strength Milestone',
      description: 'Record your strength achievements',
      unit: 'milestones',
      icon: '🏋️'
    },
    {
      id: 'sleep_quality',
      title: 'Sleep Quality',
      description: 'Track your sleep consistency',
      unit: 'days',
      icon: '😴'
    },
    {
      id: 'hydration',
      title: 'Hydration Goal',
      description: 'Track your daily water intake',
      unit: 'liters',
      icon: '💧'
    },
    {
      id: 'yoga_mastery',
      title: 'Yoga Mastery',
      description: 'Track your yoga pose progress',
      unit: 'poses',
      icon: '🧘‍♀️'
    },
    {
      id: 'training_technique',
      title: 'Training Technique',
      description: 'Track your technique mastery',
      unit: 'techniques',
      icon: '🎯'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAchievement || !progress) {
      setError('Please select an achievement and enter your progress');
      return;
    }

    try {
      const selectedTemplate = achievementTemplates.find(
        (a) => a.id === selectedAchievement
      );

      await api.post('/api/progress-updates', {
        achievementId: selectedAchievement,
        progress: parseFloat(progress),
        notes,
        unit: selectedTemplate.unit
      });

      navigate('/achievements');
    } catch (err) {
      setError('Failed to save progress update. Please try again.');
      console.error('Error saving progress update:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Add Progress Update</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Achievement
            </label>
            <select
              value={selectedAchievement}
              onChange={(e) => setSelectedAchievement(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Choose an achievement</option>
              {achievementTemplates.map((achievement) => (
                <option key={achievement.id} value={achievement.id}>
                  {achievement.icon} {achievement.title}
                </option>
              ))}
            </select>
          </div>

          {selectedAchievement && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress ({achievementTemplates.find(a => a.id === selectedAchievement)?.unit})
              </label>
              <input
                type="number"
                step="0.1"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="4"
              placeholder="Add any notes about your progress, challenges, or feelings..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/achievements')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProgressUpdate; 