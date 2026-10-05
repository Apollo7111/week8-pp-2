import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");

  const navigate = useNavigate();


  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch("/api/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        phoneNumber,
        name,
        role,
      }),
    });
    const user = await response.json();

    if (!response.ok) {
      console.log("Error in signUp")
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    console.log("success");
    navigate("/");
  }



  return (
    <div className="create">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <label>Phone number:</label>
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <label>Role:</label>
         <select
          value={role}
          onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="trainer">Trainer</option>
        </select>
        <button>Sign up</button>
      </form>
    </div>
  );
};
export default SignUpPage;
