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
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Nutrition = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/meals`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMeals(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching meals:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/meals`,
        newMeal,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchMeals();
      setNewMeal({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
      });
    } catch (error) {
      console.error('Error adding meal:', error);
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
        Nutrition Tracker
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add New Meal
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Meal Name"
                name="name"
                value={newMeal.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Calories"
                name="calories"
                type="number"
                value={newMeal.calories}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Protein (g)"
                name="protein"
                type="number"
                value={newMeal.protein}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Carbs (g)"
                name="carbs"
                type="number"
                value={newMeal.carbs}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Fats (g)"
                name="fats"
                type="number"
                value={newMeal.fats}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddMeal}
                fullWidth
              >
                Add Meal
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Today's Meals
      </Typography>
      <Grid container spacing={3}>
        {meals.map((meal) => (
          <Grid item xs={12} sm={6} md={4} key={meal._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {meal.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Calories: {meal.calories}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Protein: {meal.protein}g
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Carbs: {meal.carbs}g
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fats: {meal.fats}g
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Nutrition; 