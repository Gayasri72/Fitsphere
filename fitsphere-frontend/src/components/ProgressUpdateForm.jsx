import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ProgressUpdateForm = ({ onUpdate }) => {
  const { user } = useAuth();
  const [templateType, setTemplateType] = useState('');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  const templates = [
    { type: 'workout', label: 'Completed a workout session' },
    { type: 'personal_best', label: 'Achieved a new personal best' },
    { type: 'technique', label: 'Learned a new exercise technique' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!templateType) {
      setError('Please select a template type');
      return;
    }

    try {
      const response = await api.post('/progress-updates', null, {
        params: {
          templateType,
          title,
          details
        }
      });
      onUpdate(response.data);
      setTemplateType('');
      setTitle('');
      setDetails('');
      setError('');
    } catch (err) {
      setError('Failed to create progress update');
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Share Your Progress</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Template
          </label>
          <select
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
          >
            <option value="">Choose a template</option>
            {templates.map((template) => (
              <option key={template.type} value={template.type}>
                {template.label}
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your update a title"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Details
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Share your experience, feelings, and challenges..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none min-h-[100px]"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Share Progress
        </button>
      </form>
    </div>
  );
};

export default ProgressUpdateForm; 