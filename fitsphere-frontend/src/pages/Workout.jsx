import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import AchievementModal from '../components/AchievementModal';

const Workout = () => {
  const { user } = useAuth();
  const [workoutProgress, setWorkoutProgress] = useState(0);
  const [exerciseType, setExerciseType] = useState('🏋️ Completed a Workout Session');
  const [daysCompleted, setDaysCompleted] = useState(0);
  const [error, setError] = useState(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);

  // Exercise types and their target days
  const exercises = [
    { type: '🏋️ Completed a Workout Session', targetDays: 30 },
    { type: '🧠 Overcame a meditation Challenge', targetDays: 30 },
    { type: '🧃 Ate a Balanced Plate', targetDays: 30 },
    { type: '💧 Hit My Hydration Goal', targetDays: 30 }
  ];

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`workout_${exerciseType}_${user?.id}`);
    const savedDays = localStorage.getItem(`days_${exerciseType}_${user?.id}`);
    
    if (savedProgress) {
      setWorkoutProgress(parseFloat(savedProgress));
    }
    if (savedDays) {
      setDaysCompleted(parseInt(savedDays));
    }
  }, [exerciseType, user]);

  const handleProgressUpdate = async (day) => {
    if (!user) {
      setError("You need to be logged in to update progress");
      return;
    }

    // Only allow clicking the next day or the last completed day
    if (day !== daysCompleted + 1 && day !== daysCompleted - 1) {
      return;
    }

    try {
      setError(null);
      const newDaysCompleted = day === daysCompleted + 1 ? daysCompleted + 1 : daysCompleted - 1;
      const newProgress = (newDaysCompleted / 30) * 100;
      
      // Update local state
      setDaysCompleted(newDaysCompleted);
      setWorkoutProgress(newProgress);

      // Save to localStorage
      localStorage.setItem(`workout_${exerciseType}_${user?.id}`, newProgress.toString());
      localStorage.setItem(`days_${exerciseType}_${user?.id}`, newDaysCompleted.toString());

      // If user completed 30 days, show achievement modal
      if (newDaysCompleted === 30) {
        setShowAchievementModal(true);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError("There was an issue with your session. Please try again.");
        // Refresh the token or handle auth error without redirecting
        try {
          await api.get('/users/refresh-token');
        } catch {
          setError("Failed to refresh session. Please try updating again.");
        }
      } else {
        setError('Failed to update progress. Please try again.');
      }
    }
  };

  const handleExerciseChange = (type) => {
    setExerciseType(type);
    const savedProgress = localStorage.getItem(`workout_${type}_${user?.id}`);
    const savedDays = localStorage.getItem(`days_${type}_${user?.id}`);
    
    setWorkoutProgress(savedProgress ? parseFloat(savedProgress) : 0);
    setDaysCompleted(savedDays ? parseInt(savedDays) : 0);
  };

  // Get icon based on day status
  const getDayIcon = (day) => {
    if (daysCompleted >= day) {
      return '✓';
    } else if (day === daysCompleted + 1) {
      return '→';
    } else {
      return '○';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">My Progress</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Exercise Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {exercises.map((exercise) => (
            <button
              key={exercise.type}
              onClick={() => handleExerciseChange(exercise.type)}
              className={`p-4 rounded-xl font-semibold transition-all duration-200 ${
                exerciseType === exercise.type
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              {exercise.type}
            </button>
          ))}
        </div>

        {/* Main Progress Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{exerciseType}</h2>
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {daysCompleted} / 30
            </div>
            <div className="text-gray-500 text-lg">Days Completed</div>
          </div>

          {/* Progress Bar */}
          <div className="h-4 bg-gray-100 rounded-full mb-10">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${workoutProgress}%` }}
            />
          </div>

          {/* Daily Progress */}
          <div className="grid grid-cols-10 gap-3">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => handleProgressUpdate(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-base font-medium transition-all duration-200 ${
                  daysCompleted >= day
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                    : day === daysCompleted + 1
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer'
                    : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                }`}
              >
                <span className="text-xs mb-1">{getDayIcon(day)}</span>
                <span>{day}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {showAchievementModal && (
        <AchievementModal
          isOpen={showAchievementModal}
          onClose={() => setShowAchievementModal(false)}
          exerciseType={exerciseType}
          daysCompleted={30}
        />
      )}
    </div>
  );
};

export default Workout;