import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Navbar from "./components/Navbar";
import OAuthCallback from "./pages/OAuthCallback";
import Achievements from "./pages/Achievements";
import ProgressUpdates from "./pages/ProgressUpdates";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:postId" element={<CreatePost />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/progress-updates" element={<ProgressUpdates />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
