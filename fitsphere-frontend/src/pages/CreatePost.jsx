import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const CreatePost = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in. Please log in to create a post.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      await axios.post("/posts", formData, config);
      alert("Post created successfully!");
      navigate("/"); // Redirect to home page after successful post
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert(
          "You are not authorized to create a post. Please check your login status."
        );
      } else {
        console.error("Failed to create post", err);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Create a New Post
        </h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's on your mind? Share your thoughts..."
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-blue-300 focus:outline-none resize-none min-h-[100px] text-gray-800 bg-blue-50"
        ></textarea>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-lg p-4 cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
            <span className="text-blue-600 font-medium mb-2">Add Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
            {image && (
              <span className="text-xs text-gray-600 mt-2">{image.name}</span>
            )}
          </label>
          <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 rounded-lg p-4 cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition">
            <span className="text-indigo-600 font-medium mb-2">Add Video</span>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
              className="hidden"
            />
            {video && (
              <span className="text-xs text-gray-600 mt-2">{video.name}</span>
            )}
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-lg font-semibold text-lg shadow-md hover:from-blue-600 hover:to-indigo-600 transition"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
