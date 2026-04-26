const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.glow} />
      <div style={styles.container}>
        <div style={styles.top}>
          <div style={styles.brand}>
            <p style={styles.logo}>🌿 RecipeNest</p>
            <p style={styles.tagline}>
              Where culinary art meets digital excellence
            </p>
          </div>
          <div style={styles.links}>
            <p style={styles.linkTitle}>Navigate</p>
            <a href="/" style={styles.link}>Home</a>
            <a href="/login" style={styles.link}>Login</a>
            <a href="/register" style={styles.link}>Register</a>
          </div>
        </div>
        <div style={styles.bottom}>
          <div style={styles.divider} />
          <p style={styles.copy}>
            © {new Date().getFullYear()} RecipeNest — Built with MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    position: 'relative',
    backgroundColor: '#050505',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginTop: 'auto',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem 2rem',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '2rem',
    marginBottom: '2rem',
  },
  brand: {},
  logo: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#10b981',
    marginBottom: '0.5rem',
    letterSpacing: '-0.5px',
  },
  tagline: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.85rem',
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  linkTitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '0.75rem',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '0.25rem',
  },
  link: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.875rem',
    transition: 'color 0.2s',
  },
  bottom: {},
  divider: {
    height: '1px',
    background: 'rgba(255,255,255,0.06)',
    marginBottom: '1.5rem',
  },
  copy: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: '0.8rem',
    textAlign: 'center',
    letterSpacing: '0.5px',
  },
};

export default Footer;