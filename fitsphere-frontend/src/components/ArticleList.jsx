import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ArticleList = () => {
    console.log('ArticleList component mounted');

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = JSON.parse(localStorage.getItem('user'));
                setUser(userData);

                console.log('Fetched user:', userData);
                console.log('Token:', token);

                const response = await axios.get('http://localhost:8081/api/articles', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Fetched articles:', response.data);
                setArticles(response.data);
            } catch (err) {
                console.error('Error fetching articles:', err);
                setError('Failed to fetch articles');
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this article?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8081/api/articles/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setArticles(articles.filter(article => article.id !== id));
        } catch (err) {
            setError('Failed to delete article');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-8">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Articles</h1>
            
            <div className="grid gap-6">
                {articles.map(article => (
                    <div key={article.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                                <p className="text-gray-600 mb-4">{article.content}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>Tag: {article.tag}</span>
                                    <span>Created by {article.author.username}</span>
                                    <span>on {new Date(article.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            {user?.sub === article.author.username && (
                                <div className="flex gap-2">
                                    <Link
                                        to={`/edit-article/${article.id}`}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(article.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArticleList;