import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const AchievementModal = ({ isOpen, onClose, exerciseType, daysCompleted }) => {
  const [userReflection, setUserReflection] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("You need to be logged in to share achievements");
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      const userId = user?.id || user?.sub;
      if (!userId) {
        throw new Error('User ID not found');
      }

      // First create the achievement
      const achievementResponse = await api.post("/achievements", {
        userId,
        exerciseType,
        daysCompleted,
        userReflection
      });

      // Then create a post about the achievement
      const formData = new FormData();
      const description = `🏆 Achievement Unlocked: ${achievementResponse.data.title}\n\n${achievementResponse.data.description}${userReflection ? `\n\nReflection: ${userReflection}` : ''}`;
      formData.append('description', description);

      await api.post('/posts', formData);
      
      onClose();
      navigate('/achievements');
    } catch (error) {
      console.error("Error sharing achievement:", error);
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        navigate('/login');
      } else if (error.response?.status === 403) {
        setError("You don't have permission to share achievements. Please try logging in again.");
        navigate('/login');
      } else {
        setError(error.message || "Failed to share achievement. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎉 Congratulations!</h2>
        <p className="text-lg text-gray-700 mb-4">
          You've completed {exerciseType} exercises for {daysCompleted} days!
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="reflection" className="block text-sm font-medium text-gray-700 mb-2">
              Share your thoughts (optional)
            </label>
            <textarea
              id="reflection"
              rows="4"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="How do you feel about this achievement? Any tips for others?"
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sharing...
                </span>
              ) : (
                "Share Achievement"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AchievementModal;