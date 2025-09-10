import { useAuth } from '../store/auth';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute({
  requiredRole,
}: {
  requiredRole?: string;
}) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/unauthorized" />;

  return <Outlet />;
}
