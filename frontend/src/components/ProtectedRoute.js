import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This component wraps any page that requires login
// If not logged in → redirect to /login
// If logged in → show the page normally
const ProtectedRoute = ({ children }) => {
  const { chef, loading } = useAuth();

  // Still checking localStorage — show nothing yet
  if (loading) return <div>Loading...</div>;

  // Not logged in → kick to login page
  if (!chef) return <Navigate to="/login" />;

  // Logged in → show the protected page
  return <>{children}</>;
};

export default ProtectedRoute;