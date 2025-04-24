import { useState } from "react";
import axios from "../api/axios";

const CreatePost = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

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

      console.log("Token being sent:", token); // Debugging log

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      await axios.post("/posts", formData, config);
      alert("Post created successfully!");
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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-10">
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Write your post description..."
        className="w-full p-2 border rounded mb-4"
      ></textarea>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-4"
      />
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
        className="mb-4"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Post
      </button>
    </form>
  );
};

export default CreatePost;
