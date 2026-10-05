import WorkoutListing from "./WorkoutListing";

const WorkoutListings = ({ workouts }) => {
  return (
    <div className="workout-list">
      {workouts.map((workout) => (
        <WorkoutListing key={workout._id} workout={workout} />
      ))}
    </div>
  );
};

export default WorkoutListings;

