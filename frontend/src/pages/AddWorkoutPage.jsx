import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AddWorkoutPage = () => {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const navigate = useNavigate();
  const addWorkout = async (newWorkout) => {
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWorkout),
      });
      console.log(res)
      if (!res.ok) {
        throw new Error("Failed to add Workout");
      }
      return true;
    } catch (error) {
      console.error("Error adding Workout:", error);
      return false;
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const newWorkout = {
      title: title,
      difficulty: difficulty,
      description: description,
      price: price
    }
    console.log("Form submitted");

     const success = await addWorkout(newWorkout);
    if (success) {
      console.log("Vehicle Added Successfully");
      navigate("/");
    } else {
      console.error("Failed to add the Vehicle");
    }
  };

  return (
    <div className="create">
      <h2>Add a New Workout</h2>
      <form onSubmit={submitForm}>
        <label>Title:</label>
        <input type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Difficulty:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <label>Description:</label>
        <textarea
          type="text"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}></textarea>
        <label>Price:</label>
        <input type="number" step="0.01" min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)} required />
        <button>Add Workout</button>
      </form>
    </div >
  );
};

export default AddWorkoutPage;
