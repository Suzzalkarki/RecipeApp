import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'foodlover',
  });
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
    if (!formData.name || !formData.email || !formData.password)
      return setError('Please fill all fields');
    if (formData.password.length < 6)
      return setError('Password must be at least 6 characters');

    try {
      setLoading(true);
      setError('');
      const { data } = await API.post('/auth/register', formData);
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
        <div style={styles.formCard}>
          {/* Header */}
          <div style={styles.formHeader}>
            <Link to="/" style={styles.backLogo}>🌿 RecipeNest</Link>
            <h1 style={styles.formTitle}>Create your account</h1>
            <p style={styles.formSubtitle}>Join our culinary community today</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Role Selector — at the top! */}
            <div style={styles.field}>
              <label style={styles.label}>I want to join as</label>
              <div style={styles.roleGrid}>
                <div
                  onClick={() => setFormData({ ...formData, role: 'foodlover' })}
                  style={{
                    ...styles.roleCard,
                    ...(formData.role === 'foodlover' ? styles.roleActive : {}),
                  }}
                >
                  <span style={styles.roleEmoji}>🍽️</span>
                  <span style={styles.roleTitle}>Food Lover</span>
                  <span style={styles.roleDesc}>Explore & discover recipes</span>
                  {formData.role === 'foodlover' && (
                    <span style={styles.roleCheck}>✓</span>
                  )}
                </div>

                <div
                  onClick={() => setFormData({ ...formData, role: 'chef' })}
                  style={{
                    ...styles.roleCard,
                    ...(formData.role === 'chef' ? styles.roleActive : {}),
                  }}
                >
                  <span style={styles.roleEmoji}>👨‍🍳</span>
                  <span style={styles.roleTitle}>Chef</span>
                  <span style={styles.roleDesc}>Share your recipes</span>
                  {formData.role === 'chef' && (
                    <span style={styles.roleCheck}>✓</span>
                  )}
                </div>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="input-dark"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
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
                placeholder="Min 6 characters"
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
              {loading ? 'Creating account...' : `Join as ${formData.role === 'chef' ? 'Chef 👨‍🍳' : 'Food Lover 🍽️'} →`}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.switchLink}>Sign in</Link>
          </p>
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
    top: '20%',
    right: '20%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  container: {
    width: '100%',
    maxWidth: '520px',
    position: 'relative',
    zIndex: 1,
  },
  formCard: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '2.5rem',
  },
  formHeader: { marginBottom: '2rem' },
  backLogo: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#10b981',
    display: 'block',
    marginBottom: '1.5rem',
    letterSpacing: '-0.3px',
  },
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
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  roleCard: {
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '1.25rem 1rem',
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem',
    background: 'rgba(255,255,255,0.03)',
    transition: 'all 0.2s',
  },
  roleActive: {
    border: '1px solid rgba(16,185,129,0.5)',
    background: 'rgba(16,185,129,0.08)',
    boxShadow: '0 0 20px rgba(16,185,129,0.1)',
  },
  roleEmoji: { fontSize: '1.8rem', marginBottom: '0.25rem' },
  roleTitle: {
    fontWeight: '700',
    fontSize: '0.875rem',
    color: '#fff',
    letterSpacing: '-0.2px',
  },
  roleDesc: {
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '400',
  },
  roleCheck: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    color: '#fff',
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
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
    letterSpacing: '0.3px',
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

export default Register;