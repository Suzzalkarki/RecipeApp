import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'foodlover',   // default selection
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, chef } = useAuth();
  const navigate = useNavigate();

  // Already logged in — redirect away
  if (chef) return <Navigate to="/" />;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      return setError('Please fill all fields');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setLoading(true);
      setError('');

      const { data } = await API.post('/auth/register', formData);
      login(data);  // saves token + user info including role

      // Redirect based on role
      if (data.role === 'chef') {
        navigate('/dashboard');
      } else {
        navigate('/');  // food lovers go to home
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Join RecipeNest</h1>
        <p style={styles.subtitle}>Create your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>

          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              style={styles.input}
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
              style={styles.input}
            />
          </div>

          {/* ✅ NEW — Role Selector */}
          <div style={styles.field}>
            <label style={styles.label}>I am a...</label>
            <div style={styles.roleContainer}>

              {/* Food Lover Option */}
              <div
                onClick={() => setFormData({ ...formData, role: 'foodlover' })}
                style={{
                  ...styles.roleCard,
                  ...(formData.role === 'foodlover' ? styles.roleCardActive : {}),
                }}
              >
                <span style={styles.roleEmoji}>🍽️</span>
                <span style={styles.roleTitle}>Food Lover</span>
                <span style={styles.roleDesc}>Explore recipes and chefs</span>
              </div>

              {/* Chef Option */}
              <div
                onClick={() => setFormData({ ...formData, role: 'chef' })}
                style={{
                  ...styles.roleCard,
                  ...(formData.role === 'chef' ? styles.roleCardActive : {}),
                }}
              >
                <span style={styles.roleEmoji}>👨‍🍳</span>
                <span style={styles.roleTitle}>Chef</span>
                <span style={styles.roleDesc}>Share your recipes</span>
              </div>

            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.switchLink}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2.5rem',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    width: '100%',
    maxWidth: '460px',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: '#666',
    marginBottom: '1.5rem',
  },
  error: {
    backgroundColor: '#ffeaea',
    color: '#e74c3c',
    padding: '10px 14px',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    border: '1px solid #f5c6cb',
  },
  field: { marginBottom: '1.2rem' },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '500',
    fontSize: '0.9rem',
    color: '#444',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  // Role selector styles
  roleContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  roleCard: {
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    padding: '1rem',
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem',
    transition: 'all 0.2s',
    backgroundColor: '#fafafa',
  },
  roleCardActive: {
    border: '2px solid #e74c3c',
    backgroundColor: '#ffeaea',
  },
  roleEmoji: {
    fontSize: '2rem',
  },
  roleTitle: {
    fontWeight: '700',
    fontSize: '0.95rem',
    color: '#1a1a1a',
  },
  roleDesc: {
    fontSize: '0.75rem',
    color: '#666',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '0.5rem',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#666',
    fontSize: '0.9rem',
  },
  switchLink: {
    color: '#e74c3c',
    fontWeight: '600',
  },
};

export default Register;