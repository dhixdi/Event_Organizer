import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './ui/Spinner';

export default function PrivateRoute({ roles = [] }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner size="lg" />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}