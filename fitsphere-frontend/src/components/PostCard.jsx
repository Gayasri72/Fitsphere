import React from "react";

const PostCard = ({ post }) => {
  return (
    <div className="p-4 border rounded mb-4">
      <p>{post.description}</p>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post Image" className="mt-2 max-w-full" />
      )}
      {post.videoUrl && (
        <video controls className="mt-2 max-w-full">
          <source src={post.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default PostCard;
