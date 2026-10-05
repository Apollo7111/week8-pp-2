import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const EditWorkoutPage = () => {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();



  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const res = await fetch(`/api/workouts/${id}`);
        const data = await res.json();
        setTitle(data.title);
        setDifficulty(data.difficulty);
        setDescription(data.description);
        setPrice(data.price);
      } catch (error) {
        console.error("Error fetching workout:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [id]);

  const updateWorkout = async (newWorkout) => {
    try {
      const res = await fetch(`/api/workouts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWorkout),
      });
      if (!res.ok) {
        throw new Error("Failed to update workout");
      }
      return true;
    } catch (error) {
      console.error("Error updating workout:", error);
      return false;
    }
  };
const submitForm = (e) => {
    e.preventDefault();

    const updatedWorkout = {
      title: title,
      difficulty: difficulty,
      description: description,
      price: price
    }
    updateWorkout(updatedWorkout);
    return navigate(`/workouts/${id}`);
  };
  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="create">
      <h2>Update a Workout</h2>
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
    </div>
  );
};

export default EditWorkoutPage;

