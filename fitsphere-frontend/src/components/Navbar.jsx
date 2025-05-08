import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Don't render navbar until we know if user is null or logged in
  if (user === undefined) return null;

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="text-xl font-bold">
          FitSphere
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/articles" className="hover:underline">
            Articles
          </Link>

          {user?.sub ? (
            <>
              <Link to="/create" className="hover:underline">
                Create Post
              </Link>
              <Link to="/create-article" className="hover:underline">
                Create Articles
              </Link>
              <Link to={`/profile/${user.sub}`} className="hover:underline">
                My Profile
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
