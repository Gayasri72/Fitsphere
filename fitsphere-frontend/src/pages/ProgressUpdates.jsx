import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { FaPlus, FaEdit, FaTrash, FaTrophy, FaDumbbell, FaGraduationCap } from 'react-icons/fa';

const ProgressUpdates = () => {
  const { user } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [formData, setFormData] = useState({
    templateType: '',
    title: '',
    details: ''
  });
  const [loading, setLoading] = useState(true);

  const templates = [
    {
      type: 'WORKOUT_COMPLETED',
      title: 'Completed a workout session',
      icon: <FaDumbbell className="text-blue-500" />,
      color: 'bg-blue-50 text-blue-700'
    },
    {
      type: 'PERSONAL_BEST',
      title: 'Achieved a new personal best',
      icon: <FaTrophy className="text-yellow-500" />,
      color: 'bg-yellow-50 text-yellow-700'
    },
    {
      type: 'NEW_TECHNIQUE',
      title: 'Learned a new exercise technique',
      icon: <FaGraduationCap className="text-green-500" />,
      color: 'bg-green-50 text-green-700'
    }
  ];

  useEffect(() => {
    if (user?.id) {
      fetchUpdates();
    }
  }, [user]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/progress-updates/user/${user.id}`);
      setUpdates(response.data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUpdate) {
        await axios.put(`/progress-updates/${editingUpdate.id}`, formData);
      } else {
        await axios.post('/progress-updates', formData);
      }
      setShowForm(false);
      setEditingUpdate(null);
      setFormData({ templateType: '', title: '', details: '' });
      fetchUpdates();
    } catch (error) {
      console.error('Error saving update:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this update?')) {
      try {
        await axios.delete(`/progress-updates/${id}`);
        fetchUpdates();
      } catch (error) {
        console.error('Error deleting update:', error);
      }
    }
  };

  const handleEdit = (update) => {
    setEditingUpdate(update);
    setFormData({
      templateType: update.templateType,
      title: update.title,
      details: update.details
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Progress Updates</h1>
            <p className="mt-2 text-gray-600">Track and celebrate your fitness journey</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingUpdate(null);
              setFormData({ templateType: '', title: '', details: '' });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FaPlus /> New Update
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {editingUpdate ? 'Edit Update' : 'New Progress Update'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template
                  </label>
                  <select
                    value={formData.templateType}
                    onChange={(e) => setFormData({ ...formData, templateType: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a template</option>
                    {templates.map((template) => (
                      <option key={template.type} value={template.type}>
                        {template.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Details
                  </label>
                  <textarea
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingUpdate(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
                  >
                    {editingUpdate ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {updates.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No updates yet</h3>
              <p className="text-gray-600 mb-4">Start tracking your fitness journey by creating your first update!</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                Create First Update
              </button>
            </div>
          ) : (
            updates.map((update) => {
              const template = templates.find(t => t.type === update.templateType);
              return (
                <div
                  key={update.id}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${template?.color || 'bg-gray-100'}`}>
                        {template?.icon || '📝'}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {update.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(update.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(update)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(update.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    {update.details}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressUpdates; 