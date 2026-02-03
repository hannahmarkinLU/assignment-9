import { Link, useLocation } from "react-router-dom";
import { useArticles } from "../context/ArticlesContext";
import { useAuth } from "../context/AuthContext";

function Navigation() {
  const location = useLocation();
  const auth = useAuth(); // First, get the entire auth object
  const { getUserSavedArticles } = useArticles();

  // Destructure after getting auth, with a fallback
  const { user, logout, isAuthenticated, isAdmin } = auth || {};

  // Debug logging - INSIDE the component
  console.log("Auth object:", auth);
  console.log("User:", user);
  console.log("Is authenticated:", isAuthenticated);
  console.log("Is admin function:", isAdmin);
  console.log("Is admin result:", isAdmin ? isAdmin() : "No isAdmin function");
  console.log("User role:", user?.role);

  // get only the current user's saved article count
  const savedCount = getUserSavedArticles().length;

  return (
    <nav>
      <div className="nav-container">
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <h1 className="nav-brand">NewsReader</h1>

          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              Home
            </Link>

            <Link
              to="/search"
              className={`nav-link ${
                location.pathname === "/search" ? "active" : ""
              }`}
            >
              Search
            </Link>

            {isAuthenticated && (
              <Link
                to="/saved"
                className={`nav-link ${
                  location.pathname === "/saved" ? "active" : ""
                }`}
              >
                Saved Articles ({savedCount})
              </Link>
            )}

            {/* show admin link only for admin users */}
            {isAuthenticated && isAdmin && isAdmin() && (
              <Link
                to="/admin"
                className={`nav-link ${
                  location.pathname === "/admin" ? "active" : ""
                }`}
              >
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="auth-section">
          {isAuthenticated ? (
            <div className="user-info">
              {user && (
                <span className="username">Hello, {user.username}!</span>
              )}
              <button onClick={logout} className="logout-button">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
