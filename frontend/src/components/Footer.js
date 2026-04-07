const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.logo}>🍳 RecipeNest</p>
        <p style={styles.tagline}>
          Connecting chefs and food lovers everywhere
        </p>
        <p style={styles.copy}>
          © {new Date().getFullYear()} RecipeNest. Built with MERN Stack.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    marginTop: 'auto',
    padding: '2.5rem 1.5rem',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  logo: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#e74c3c',
  },
  tagline: {
    color: '#aaa',
    fontSize: '0.9rem',
  },
  copy: {
    color: '#666',
    fontSize: '0.8rem',
    marginTop: '0.5rem',
  },
};

export default Footer;