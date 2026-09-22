import { useState } from "react";
import { Link } from "react-router-dom";
function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = () => {
    setIsLoading(true); //loading started
    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        return response.json().then((data) => {
          if (!response.ok) {
            throw new Error(data.message);
          }
          return data;
        });
      })
      .then((data) => {
        setMessage(data.message || "Registration successful");
        setIsLoading(false); //loading ended
      })
      .catch((error) => {
        setMessage(error.message);
        setIsLoading(false);
      });
  };

  return (
    <div>
      <h1>Create Account</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={registerUser} disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </button>
      <p>{message}</p>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
