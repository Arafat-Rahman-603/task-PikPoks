import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * Restricts access to specific roles.
 * Usage: <RoleProtectedRoute roles={['manager', 'admin']}>...</RoleProtectedRoute>
 */
const RoleProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-loader">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
