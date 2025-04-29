import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

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

  const templates = [
    {
      type: 'WORKOUT_COMPLETED',
      title: 'Completed a workout session',
      icon: '💪'
    },
    {
      type: 'PERSONAL_BEST',
      title: 'Achieved a new personal best',
      icon: '🏆'
    },
    {
      type: 'NEW_TECHNIQUE',
      title: 'Learned a new exercise technique',
      icon: '🎯'
    }
  ];

  useEffect(() => {
    if (user?.id) {
      fetchUpdates();
    }
  }, [user]);

  const fetchUpdates = async () => {
    try {
      const response = await axios.get(`/api/progress-updates/user/${user.id}`);
      setUpdates(response.data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUpdate) {
        await axios.put(`/api/progress-updates/${editingUpdate.id}`, formData);
      } else {
        await axios.post('/api/progress-updates', formData);
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
        await axios.delete(`/api/progress-updates/${id}`);
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Fitness Progress Updates</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingUpdate(null);
            setFormData({ templateType: '', title: '', details: '' });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FaPlus /> New Update
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
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
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Select a template</option>
                  {templates.map((template) => (
                    <option key={template.type} value={template.type}>
                      {template.icon} {template.title}
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
                  className="w-full p-2 border rounded-lg"
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
                  className="w-full p-2 border rounded-lg"
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
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingUpdate ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {updates.map((update) => {
          const template = templates.find(t => t.type === update.templateType);
          return (
            <div
              key={update.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{template?.icon || '📝'}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {update.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(update.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(update)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(update.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="mt-4 text-gray-700">{update.details}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressUpdates; 