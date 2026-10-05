import { NavLink } from "react-router-dom";
const handleClick = () => {
    // setIsAuthenticated(false);
    localStorage.removeItem("user");
  };
const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Workout</h1>
      <div className="links">
        <NavLink to="/">
        Home
        </NavLink>
        <NavLink to="/add-workout">
        Add Rental
        </NavLink>
        <NavLink to="/login">
        Login
        </NavLink>
        <NavLink to="/signup">
        SignUp
        </NavLink>
        <button onClick={handleClick}>Log out</button>
      </div>
    </nav>
  );
};

export default Navbar;
