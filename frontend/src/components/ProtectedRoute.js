import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Two types of protection:
// type="auth"  → any logged in user (chef or foodlover)
// type="chef"  → only chefs allowed

const ProtectedRoute = ({ children, type = 'auth' }) => {
  const { chef, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Not logged in at all
  if (!chef) return <Navigate to="/login" />;

  // Logged in but wrong role for this route
  if (type === 'chef' && chef.role !== 'chef') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;