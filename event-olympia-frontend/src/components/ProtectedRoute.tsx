import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  type: 'auth' | 'guest' | 'admin';
}

export function ProtectedRoute({ children, type }: ProtectedRouteProps) {

  // const userRole = localStorage.getItem('userRole');

  // const { isAuthenticated } = useAuth();
  // console.log("role - isauth", userRole, isAuthenticated);

  // // if (type === 'guest' && isAuthenticated) {
  // //   return <Navigate to="/" replace />;
  // // }

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  // if (type === 'admin' && isAuthenticated && userRole === 'admin') {
  //   return <Navigate to="/admin/dashboard" replace />;
  // }

  return <>{children}</>;
}