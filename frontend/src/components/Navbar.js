import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { chef, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');  // redirect to home after logout
  };

  return (
    <nav style={styles.nav}>
      {/* Logo — always visible */}
      <Link to="/" style={styles.logo}>
        🍳 RecipeNest
      </Link>

      {/* Right side — changes based on login status */}
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>

        {chef ? (
          // Logged in — show Dashboard and Logout
          <>
            <span style={styles.welcome}>Hi, {chef.name}!</span>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          // Not logged in — show Login and Register
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    height: '64px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#e74c3c',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    color: '#333',
    fontWeight: '500',
    fontSize: '0.95rem',
  },
  welcome: {
    color: '#666',
    fontSize: '0.9rem',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid #e74c3c',
    color: '#e74c3c',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  registerBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
};

export default Navbar;