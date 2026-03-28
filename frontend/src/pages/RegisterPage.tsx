import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { registerUser, loginUser } from "../api/auth";
import { setTokens } from "../lib/auth";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await registerUser({ username, email, password });
      const tokens = await loginUser({ username, password });
      setTokens(tokens.access, tokens.refresh);
      navigate("/");
    } catch {
      setError("Failed to register");
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ padding: "0 2rem 2rem" }}>
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <br />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label>Email</label>
            <br />
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
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
            Register
          </button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p style={{ marginTop: "1rem" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </main>
    </>
  );
}
