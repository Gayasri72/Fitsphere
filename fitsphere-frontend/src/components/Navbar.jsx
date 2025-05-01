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

          {/* Tags Dropdown */}
          <div className="relative group">
            <button className="hover:underline flex items-center">
              Tags
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <Link to="/tag/fitness" className="block px-4 py-2 hover:bg-blue-100">
                  #Fitness
                </Link>
                <Link to="/tag/nutrition" className="block px-4 py-2 hover:bg-blue-100">
                  #Nutrition
                </Link>
                <Link to="/tag/wellness" className="block px-4 py-2 hover:bg-blue-100">
                  #Wellness
                </Link>
                <Link to="/tag/yoga" className="block px-4 py-2 hover:bg-blue-100">
                  #Yoga
                </Link>
                <Link to="/tag/running" className="block px-4 py-2 hover:bg-blue-100">
                  #Running
                </Link>
              </div>
            </div>
          </div>

          {user?.sub && (
            <div className="flex items-center space-x-4">
              <Link to={`/profile/${user.sub}`} className="hover:underline">
                My Profile
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
