import { Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import SignInGate from './SignInGate.jsx';

/**
 * Route guard for /checkout. Not a redirect — renders the sign-in
 * form in place, and once signed in, the same route re-renders with
 * the real content via <Outlet />.
 */
function RequireAuth() {
  const { isSignedIn } = useAuth();
  return isSignedIn ? <Outlet /> : <SignInGate />;
}

export default RequireAuth;