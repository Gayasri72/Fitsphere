import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  TextField,
  Avatar,
  IconButton,
} from '@mui/material';
import { Favorite, Comment, Share } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        { content: newPost },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setNewPost('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Community
      </Typography>

      {/* Create Post */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <form onSubmit={handlePostSubmit}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Share your fitness journey..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!newPost.trim()}
            >
              Post
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} key={post._id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    src={post.author.avatar}
                    alt={post.author.name}
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1">
                      {post.author.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" paragraph>
                  {post.content}
                </Typography>

                <Box display="flex" alignItems="center" gap={2}>
                  <IconButton
                    color={post.likes.includes(user?._id) ? 'primary' : 'default'}
                    onClick={() => handleLike(post._id)}
                  >
                    <Favorite />
                  </IconButton>
                  <Typography variant="body2">
                    {post.likes.length}
                  </Typography>

                  <IconButton>
                    <Comment />
                  </IconButton>
                  <Typography variant="body2">
                    {post.comments.length}
                  </Typography>

                  <IconButton>
                    <Share />
                  </IconButton>
                </Box>

                {/* Comments Section */}
                {post.comments.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Comments
                    </Typography>
                    {post.comments.map((comment) => (
                      <Box
                        key={comment._id}
                        display="flex"
                        alignItems="start"
                        mb={1}
                      >
                        <Avatar
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          sx={{ width: 24, height: 24, mr: 1 }}
                        />
                        <Box>
                          <Typography variant="subtitle2">
                            {comment.author.name}
                          </Typography>
                          <Typography variant="body2">
                            {comment.content}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Community; 