import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import RoleProtectedRoute from '../components/RoleProtectedRoute.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import ManagerDashboard from '../pages/ManagerDashboard.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';

const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="page-loader">Loading...</div>;
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public routes — redirect to home if already logged in */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute roles={['manager', 'admin']}>
                <ManagerDashboard />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
