import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const WorkoutTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    totalDays: '',
  });
  const [reflection, setReflection] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/workout-templates/user');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await api.post('/workout-templates', {
        name: newTemplate.name,
        description: newTemplate.description,
        totalDays: parseInt(newTemplate.totalDays)
      });
      console.log('Create template response:', response.data);
      await fetchTemplates();
      setCreateDialogOpen(false);
      setNewTemplate({ name: '', description: '', totalDays: '' });
      setSuccess('Workout template created successfully!');
    } catch (error) {
      console.error('Error creating template:', error.response?.data || error);
      setError(error.response?.data?.error || 'Failed to create template');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkDayComplete = async (templateId, day) => {
    try {
      setError(null);
      await api.put(`/workout-templates/${templateId}/complete-day/${day}`);
      await fetchTemplates();
      setSuccess('Progress updated successfully!');
    } catch (error) {
      console.error('Error marking day complete:', error);
      setError('Failed to update progress');
    }
  };

  const handleShareAchievement = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await api.put(`/workout-templates/${selectedTemplate.id}/share`, null, {
        params: { personalReflection: reflection }
      });
      await fetchTemplates();
      setShareDialogOpen(false);
      setReflection('');
      setSelectedTemplate(null);
      setSuccess('Achievement shared successfully!');
    } catch (error) {
      console.error('Error sharing achievement:', error);
      setError('Failed to share achievement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateProgress = (template) => {
    const completed = template.completedDays.filter(day => day).length;
    return (completed / template.totalDays) * 100;
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Workout Templates
        </h1>
        <button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
            <p className="text-gray-600 mb-4">{template.description}</p>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">
                Progress: {Math.round(calculateProgress(template))}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress(template)}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {template.completedDays.map((completed, index) => (
                <button
                  key={index}
                  onClick={() => handleMarkDayComplete(template.id, index)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    completed
                      ? 'bg-green-600 text-white'
                      : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Day {index + 1}
                </button>
              ))}
            </div>

            {template.isCompleted && !template.isShared && (
              <button
                onClick={() => {
                  setSelectedTemplate(template);
                  setShareDialogOpen(true);
                }}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Share Achievement
              </button>
            )}

            {template.isShared && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-blue-600 font-medium mb-2">
                  {template.achievementMessage}
                </p>
                <p className="text-gray-600 text-sm">
                  {template.personalReflection}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Template Dialog */}
      {createDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Workout Template</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  rows="3"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Days
                </label>
                <input
                  type="number"
                  value={newTemplate.totalDays}
                  onChange={(e) => setNewTemplate({ ...newTemplate, totalDays: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setCreateDialogOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                disabled={isSubmitting || !newTemplate.name || !newTemplate.description || !newTemplate.totalDays}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Create'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Achievement Dialog */}
      {shareDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Share Your Achievement</h2>
            {selectedTemplate && (
              <p className="text-lg text-gray-600 mb-4">
                {selectedTemplate.achievementMessage}
              </p>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personal Reflection
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows="4"
                placeholder="Share your thoughts about completing this workout journey..."
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShareDialogOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleShareAchievement}
                disabled={isSubmitting || !reflection}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Share'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutTemplates;