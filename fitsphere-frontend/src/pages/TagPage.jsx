import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TagPage = () => {
  const { tag } = useParams();
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/articles/tag/${tag}`);
        setArticles(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch articles");
        console.error(err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [tag]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">#{tag}</h1>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">No articles found for this tag.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
              <p className="text-gray-600 mb-4">{article.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>By {article.author?.username || 'Anonymous'}</span>
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagPage; 