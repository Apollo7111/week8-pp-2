import WorkoutListings from "../components/WorkoutListings";
import { useState, useEffect } from "react";

const Home = () => {
  const [workouts, setWorkouts] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("/api/workouts");
        if (!response.ok) throw new Error("Could not fetch workouts");
        const data = await response.json();
        setWorkouts(data);
        setIsPending(false);
      } catch (err) {
        setError(err.message);
        setIsPending(false);
      }
    };
    fetchWorkouts();
  }, []);

  return (
    <div className="home">
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      {workouts && <WorkoutListings workouts={workouts} />}
    </div>
  );
};

export default Home;

