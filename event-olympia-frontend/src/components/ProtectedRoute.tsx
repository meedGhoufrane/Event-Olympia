import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  type: 'auth' | 'guest' | 'admin';
}

export function ProtectedRoute({ children, type }: ProtectedRouteProps) {
  const { isAuthenticated, userRole } = useAuth();

  if (type === 'guest' && isAuthenticated) {
    // If the user is authenticated and tries to access a guest-only route (like login/register),
    // redirect them to the home page or dashboard based on their role.
    return <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/'} replace />;
  }

  if (type === 'auth' && !isAuthenticated) {
    // If the user is not authenticated and tries to access a protected route,
    // redirect them to the login page.
    return <Navigate to="/login" replace />;
  }

  if (type === 'admin' && userRole !== 'admin') {
    // If the user is not an admin and tries to access an admin-only route,
    // redirect them to the home page.
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the children (the protected component).
  return <>{children}</>;
}