import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from './useAdminAuth.jsx';

/**
 * Guards the whole /admin route group. Unlike customer RequireAuth
 * (which renders a sign-in form in place), this redirects to a real
 * route — /admin/login — because admin has its own dedicated login
 * screen per the rubric's route table, not an inline gate.
 */
function RequireAdmin() {
  const { isAdmin } = useAdminAuth();
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default RequireAdmin;