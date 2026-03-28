import { Link, useNavigate } from "react-router-dom";
import { clearTokens, isLoggedIn } from "../lib/auth";
import type { PlayerProgress } from "../api/progression";

type NavbarProps = {
  progress?: PlayerProgress | null;
};

export default function Navbar({ progress }: NavbarProps) {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  function handleLogout() {
    clearTokens();
    navigate("/login");
  }

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "1px solid #ccc",
        marginBottom: "2rem",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: "bold", textDecoration: "none" }}>
          LeetGame
        </Link>

        {loggedIn && <Link to="/">Levels</Link>}
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {loggedIn && progress && (
          <>
            <span>
              Unlocked: {progress.highest_unlocked_level_order ?? 1}
            </span>
            <span>
              Completed: {progress.completed_levels_count}
            </span>
          </>
        )}

        {loggedIn ? (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}