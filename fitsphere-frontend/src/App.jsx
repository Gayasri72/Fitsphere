import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Navbar from "./components/Navbar";
import OAuthCallback from "./pages/OAuthCallback";
import WorkoutTemplates from "./pages/WorkoutTemplates";
import SharedAchievements from "./pages/SharedAchievements";
import Workout from "./pages/Workout";

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
          <Route path="/workout-templates" element={<WorkoutTemplates />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/achievements" element={<SharedAchievements />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
