import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Zap, Briefcase, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import LogoMark from '../components/LogoMark.jsx';
import { useAdminAuth, ADMIN_USERNAME, ADMIN_PASSWORD } from './useAdminAuth.jsx';
import './AdminLogin.css';

function AdminLogin() {
  const { login, error } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleFillDemo() {
    setUsername(ADMIN_USERNAME);
    setPassword(ADMIN_PASSWORD);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const ok = login(username, password);
    if (ok) {
      const redirectTo = location.state?.from?.pathname ?? '/admin';
      navigate(redirectTo, { replace: true });
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
            <div className="admin-login__top">
                <div className="admin-login__brand">
                    <LogoMark size={36} />
                    <span>Addis Eats</span>
                </div>
                <span className="admin-login__badge">Admin Portal</span>
            </div>

            <div className="admin-login__eyebrow">
            <span>Addis Eats Dispatch Engine</span>
            </div>
        <h1>Kitchen &amp; Operations</h1>
        <p className="admin-login__subtitle">
          Sign in to manage the menu and track incoming orders.
        </p>

        <div className="admin-login__demo">
          <div className="admin-login__demo-icon">
            <Zap size={16} />
          </div>
          <div className="admin-login__demo-text">
            <span>Quick demo access</span>
            <span className="admin-login__demo-creds">
              {ADMIN_USERNAME} · {ADMIN_PASSWORD}
            </span>
          </div>
          <button type="button" className="admin-login__demo-btn" onClick={handleFillDemo}>
            Fill demo
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="admin-username">Work email or staff ID</label>
          <div className="admin-login__field">
            <Briefcase size={16} />
            <input
              id="admin-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. kifle.b@addiseats.et"
              autoComplete="username"
            />
          </div>

          <label htmlFor="admin-password">Passphrase</label>
          <div className="admin-login__field">
            <Lock size={16} />
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="admin-login__eye"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide passphrase' : 'Show passphrase'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="admin-login__error">{error}</p>}

          <button type="submit" className="btn-primary admin-login__submit">
            Enter dashboard
            <ArrowRight size={16} />
          </button>
        </form>
      </div>

      <Link to="/" className="admin-login__return">
        ← Return to customer app
      </Link>
    </div>
  );
}

export default AdminLogin;