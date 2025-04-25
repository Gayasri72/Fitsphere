import { usePosts } from "../context/PostsContext";
import PostCard from "../components/PostCard";

const Home = () => {
  const { posts, loading } = usePosts();

  return (
    <div className="max-w-2xl mx-auto mt-4 pb-16">
      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
};

export default Home;
