import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, chef } = useAuth();
  const navigate = useNavigate();

  if (chef) return <Navigate to="/" />;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password)
      return setError('Please fill all fields');

    try {
      setLoading(true);
      setError('');
      const { data } = await API.post('/auth/login', formData);
      login(data);
      if (data.role === 'chef') navigate('/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glow} />

      <div style={styles.container}>
        {/* Left side — branding */}
        <div style={styles.leftPanel}>
          <p style={styles.brandLogo}>🌿 RecipeNest</p>
          <h2 style={styles.brandTitle}>
            Cook. Share.<br />
            <span style={styles.brandAccent}>Inspire.</span>
          </h2>
          <p style={styles.brandText}>
            Join thousands of chefs and food lovers on the platform built for culinary excellence.
          </p>
          <div style={styles.features}>
            {['Share your signature recipes', 'Connect with food lovers', 'Build your chef portfolio'].map((f, i) => (
              <div key={i} style={styles.featureItem}>
                <span style={styles.featureDot}>✦</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side — form */}
        <div style={styles.formPanel}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h1 style={styles.formTitle}>Welcome back</h1>
              <p style={styles.formSubtitle}>Sign in to your account</p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="chef@example.com"
                  className="input-dark"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  className="input-dark"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <p style={styles.switchText}>
              Don't have an account?{' '}
              <Link to="/register" style={styles.switchLink}>Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: 'calc(100vh - 70px)',
    backgroundColor: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '2rem',
  },
  glow: {
    position: 'absolute',
    top: '30%',
    left: '25%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  container: {
    display: 'flex',
    width: '100%',
    maxWidth: '900px',
    gap: '4rem',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  leftPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  brandLogo: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#10b981',
    letterSpacing: '-0.5px',
  },
  brandTitle: {
    fontSize: '2.8rem',
    fontWeight: '800',
    color: '#fff',
    lineHeight: '1.2',
    letterSpacing: '-1px',
  },
  brandAccent: {
    background: 'linear-gradient(135deg, #10b981, #34d399)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  brandText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '0.95rem',
    lineHeight: '1.7',
    fontWeight: '400',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  featureDot: {
    color: '#10b981',
    fontSize: '0.75rem',
  },
  formPanel: { flex: 1 },
  formCard: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '2.5rem',
  },
  formHeader: { marginBottom: '2rem' },
  formTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.35rem',
    letterSpacing: '-0.5px',
  },
  formSubtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.875rem',
    fontWeight: '400',
  },
  errorBox: {
    background: 'rgba(248,113,113,0.1)',
    border: '1px solid rgba(248,113,113,0.25)',
    color: '#f87171',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff',
    border: 'none',
    padding: '14px',
    borderRadius: '50px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.5rem',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 20px rgba(16,185,129,0.35)',
    fontFamily: 'Poppins, sans-serif',
    transition: 'all 0.3s',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.875rem',
  },
  switchLink: {
    color: '#10b981',
    fontWeight: '600',
  },
};

export default Login;