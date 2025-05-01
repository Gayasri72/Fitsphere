import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tag: 'fitness'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8081/api/articles/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFormData(response.data);
            } catch (err) {
                setError('Failed to fetch article');
            }
        };

        fetchArticle();
    }, [id]);

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
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            await axios.put(
                `http://localhost:8081/api/articles/${id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            navigate(`/tag/${formData.tag}`);
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Please log in to edit the article');
            } else if (err.response?.status === 403) {
                setError('You are not authorized to edit this article');
            } else {
                setError(err.response?.data || 'An error occurred while updating the article');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Edit Article</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tag
                    </label>
                    <select
                        name="tag"
                        value={formData.tag}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="fitness">Fitness</option>
                        <option value="nutrition">Nutrition</option>
                        <option value="wellness">Wellness</option>
                        <option value="yoga">Yoga</option>
                        <option value="running">Running</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                >
                    {loading ? 'Updating...' : 'Update Article'}
                </button>
            </form>
        </div>
    );
};

export default EditArticle; 