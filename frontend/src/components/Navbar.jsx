import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">RBAC App</Link>
      </div>

      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/">Home</Link>

            {(user.role === 'manager' || user.role === 'admin') && (
              <Link to="/manager">Manager Dashboard</Link>
            )}

            {user.role === 'admin' && (
              <Link to="/admin">Admin Dashboard</Link>
            )}

            <span className="navbar-user">
              {user.name} <span className="role-badge">{user.role}</span>
            </span>

            <button onClick={handleLogout} className="btn btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
