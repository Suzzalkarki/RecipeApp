import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { chef, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>
        🍳 RecipeNest
      </Link>

      {/* Desktop Links */}
      <div style={styles.desktopLinks}>
        <Link to="/" style={styles.link}>
          Home
        </Link>
        {chef ? (
          <>
            <span style={styles.welcome}>
              Hi, {chef.name}!{" "}
              <span
                style={{
                  backgroundColor: chef.role === "chef" ? "#ffeaea" : "#e8f5e9",
                  color: chef.role === "chef" ? "#e74c3c" : "#2e7d32",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                }}
              >
                {chef.role === "chef" ? "👨‍🍳 Chef" : "🍽️ Food Lover"}
              </span>
            </span>
            {chef.role === "chef" && (
              <Link to="/dashboard" style={styles.link}>
                Dashboard
              </Link>
            )}
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/register" style={styles.registerBtn}>
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <button
        style={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link
            to="/"
            style={styles.mobileLink}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          {chef ? (
            <>
              <Link
                to="/dashboard"
                style={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} style={styles.mobileLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 2rem",
    height: "64px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e0e0e0",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    flexWrap: "wrap",
  },
  logo: {
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "#e74c3c",
  },
  desktopLinks: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    
  },
  link: {
    color: "#333",
    fontWeight: "500",
    fontSize: "0.95rem",
    transition: "color 0.2s",
  },
  welcome: {
    color: "#666",
    fontSize: "0.9rem",
  },
  logoutBtn: {
    background: "none",
    border: "1px solid #e74c3c",
    color: "#e74c3c",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.2s",
  },
  registerBtn: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  hamburger: {
    display: "none",
    background: "none",
    border: "none",
    fontSize: "1.4rem",
    cursor: "pointer",
    color: "#333",
    padding: "4px 8px",
    // Show on mobile via media query in CSS
  },
  mobileMenu: {
    width: "100%",
    backgroundColor: "#fff",
    borderTop: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
    padding: "1rem 0",
    gap: "0.25rem",
  },
  mobileLink: {
    padding: "10px 2rem",
    color: "#333",
    fontWeight: "500",
    fontSize: "1rem",
    display: "block",
  },
  mobileLogout: {
    background: "none",
    border: "none",
    padding: "10px 2rem",
    color: "#e74c3c",
    fontWeight: "500",
    fontSize: "1rem",
    cursor: "pointer",
    textAlign: "left",
  },
};

export default Navbar;
