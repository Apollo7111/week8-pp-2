import { NavLink } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const handleClick = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };
  return (
    <nav className="navbar">
      <h1>Workout</h1>
      <div className="links">
        <NavLink to="/">
          Home
        </NavLink>
        {isAuthenticated && (
          <div>
            <NavLink to="/add-workout">Add Workout</NavLink>
            <a><span>Welcome {JSON.parse(localStorage.getItem("user")).username}!</span></a>
            <button onClick={handleClick}>Log out</button>
          </div>
        )}
        {!isAuthenticated && (
          <div>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
