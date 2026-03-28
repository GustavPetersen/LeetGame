import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { loginUser } from "../api/auth";
import { setTokens } from "../lib/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const tokens = await loginUser({ username, password });
      setTokens(tokens.access, tokens.refresh);
      navigate("/");
    } catch {
      setError("Invalid username or password");
    }
  }

  return (
    <>
      <Navbar />

      <main style={{ padding: "0 2rem 2rem" }}>
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <br />
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label>Password</label>
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" style={{ marginTop: "1rem" }}>
            Login
          </button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p style={{ marginTop: "1rem" }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </main>
    </>
  );
}