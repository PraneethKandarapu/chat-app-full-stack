import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginUser = () => {
    setIsLoading(true);

    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
        setMessage("Login successful");
        setIsLoading(false);
        console.log(data);
      })
      .catch((error) => {
        setMessage(error.message);
        setIsLoading(false);
      });
  };

  return (
    <div>
      <h1>Login</h1>

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

      <button onClick={loginUser} disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>

      <p>{message}</p>
    </div>
  );
}

export default LoginPage;
