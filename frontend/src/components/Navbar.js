import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { chef, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav style={styles.nav}>
      {/* Blur background */}
      <div style={styles.navBg} />

      <div style={styles.navInner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🌿</span>
          <span>Recipe<span style={styles.logoAccent}>Nest</span></span>
        </Link>

        {/* Desktop Links */}
        <div style={styles.desktopLinks}>
          <Link to="/" style={styles.navLink}>Home</Link>

          {chef ? (
            <>
              <div style={styles.userBadge}>
                <span style={styles.userDot} />
                <span style={styles.userName}>{chef.name}</span>
                <span className="badge-green">
                  {chef.role === 'chef' ? '👨‍🍳 Chef' : '🍽️ Food Lover'}
                </span>
              </div>
              {chef.role === 'chef' && (
                <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
              )}
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>Login</Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          style={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
          {chef ? (
            <>
              {chef.role === 'chef' && (
                <Link to="/dashboard" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
              <button onClick={handleLogout} style={styles.mobileLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  navBg: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(10, 10, 10, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    zIndex: -1,
  },
  navInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '-0.5px',
  },
  logoIcon: { fontSize: '1.3rem' },
  logoAccent: { color: '#10b981' },
  desktopLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  navLink: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
    letterSpacing: '0.3px',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '50px',
    padding: '6px 14px',
  },
  userDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    display: 'inline-block',
    boxShadow: '0 0 6px #10b981',
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#fff',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.7)',
    padding: '8px 18px',
    borderRadius: '50px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    fontFamily: 'Poppins, sans-serif',
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.3rem',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
  mobileMenu: {
    background: 'rgba(10,10,10,0.98)',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  mobileLink: {
    padding: '12px 1rem',
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    fontSize: '0.95rem',
    borderRadius: '8px',
    display: 'block',
  },
  mobileLogout: {
    background: 'none',
    border: 'none',
    padding: '12px 1rem',
    color: '#10b981',
    fontWeight: '500',
    fontSize: '0.95rem',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'Poppins, sans-serif',
    borderRadius: '8px',
  },
};

export default Navbar;