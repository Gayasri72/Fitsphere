import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreateArticle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tag: location.state?.tag || 'fitness'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const tags = [
    { value: 'fitness', label: '#Fitness' },
    { value: 'nutrition', label: '#Nutrition' },
    { value: 'wellness', label: '#Wellness' },
    { value: 'yoga', label: '#Yoga' },
    { value: 'running', label: '#Running' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/articles', formData);
      navigate(`/tag/${formData.tag}`);
    } catch (err) {
      setError('Failed to create article. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.sub) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to create articles</h2>
          <p className="text-gray-600 mb-4">
            You need to be logged in to create and share articles with the community.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter article title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your article content here..."
          />
        </div>

        <div>
          <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
            Tag
          </label>
          <select
            id="tag"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tags.map((tag) => (
              <option key={tag.value} value={tag.value}>
                {tag.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticle; 