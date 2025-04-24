import { usePosts } from "../context/PostsContext";
import PostCard from "../components/PostCard";

const Home = () => {
  const { posts, loading } = usePosts();

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">🏋️ FitSphere Posts</h1>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available</p>
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
};

export default Home;