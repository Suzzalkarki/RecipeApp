import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Register = () => {
  // One state object for all form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');       // error message to show user
  const [loading, setLoading] = useState(false); // disable button while submitting

  const { login, chef } = useAuth();
  const navigate = useNavigate();

   // ✅ Redirect if already logged in
  if (chef) {
    return <Navigate to="/dashboard" />;
  }

  // Handles ALL input changes with one function
  // e.target.name tells us WHICH field changed
  const handleChange = (e) => {
    setFormData({
      ...formData,               // keep existing values
      [e.target.name]: e.target.value,  // update only the changed field
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // stop page from reloading on form submit

    // Basic frontend validation
    if (!formData.name || !formData.email || !formData.password) {
      return setError('Please fill all fields');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setLoading(true);
      setError('');

      // Call our backend register API
      const { data } = await API.post('/auth/register', formData);

      // Save chef data to context + localStorage
      login(data);

      // Redirect to dashboard after successful register
      navigate('/dashboard');

    } catch (err) {
      // Show error message from backend (e.g. "Email already registered")
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Join RecipeNest</h1>
        <p style={styles.subtitle}>Create your chef account</p>

        {/* Show error if exists */}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"           // must match formData key
              value={formData.name}
              onChange={handleChange}
              placeholder="Gordon Ramsay"
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
              placeholder="chef@example.com"
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
    maxWidth: '420px',
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
  field: {
    marginBottom: '1.2rem',
  },
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