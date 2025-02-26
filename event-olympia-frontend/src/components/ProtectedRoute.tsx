import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  type: 'auth' | 'guest';
}

export function ProtectedRoute({ children, type }: ProtectedRouteProps) {
  const { isAuthenticated, userRole } = useAuth(); 

  if (type === 'auth' && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (type === 'guest' && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated) {
    if (userRole === 'admin') {
      return <Navigate to="/dashboard" replace />; 
    } else if (userRole === 'user') {
      return <Navigate to="/" replace />; 
    }
  }

  return <>{children}</>;
}