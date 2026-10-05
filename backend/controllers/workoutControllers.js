const Workout = require('../models/workoutModel');
const mongoose = require('mongoose');

// GET /api/workouts
const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({}).sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/workouts
const createWorkout = async (req, res) => {
  const { title, difficulty, description, price } = req.body;
  try {
    const workout = await Workout.create({ title, difficulty, description, price });
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /api/workouts/:workoutId
const getWorkoutById = async (req, res) => {
  const { workoutId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workoutId)) {
    return res.status(404).json({ message: "Invalid workout ID" });
  }

  try {
    const workout = await Workout.findById(workoutId);
    if (workout) {
      res.status(200).json(workout);
    } else {
      res.status(404).json({ message: "Workout not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve workout" });
  }
};


// PUT /api/workouts/:workoutId
const updateWorkout = async (req, res) => {
  const { workoutId } = req.params;
  //const user_id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(workoutId)) {
    return res.status(400).json({ message: "Invalid Workout ID" });
  }
  try {
    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: workoutId },
      { ...req.body },
      { returnDocument: "after" },
    );

    if (updatedWorkout) {
      res.status(200).json(updatedWorkout);
    } else {
      res.status(404).json({ message: "Vehicle not found" });
    }

  } catch (error) {
    res.status(500).json({ message: "Failed to update a workout" });
  }
};

// DELETE /api/workouts/:workoutId
const deleteWorkout = async (req, res) => {
  const { workoutId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(workoutId)) {
    return res.status(404).json({ message: "Invalid workout ID" });
  }
  try {
    const deletedWorkout = await Workout.findOneAndDelete({ _id: workoutId });
    if (deletedWorkout) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Workout not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete workout" });
  }
};

module.exports = {
  getAllWorkouts,
  createWorkout,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
};

