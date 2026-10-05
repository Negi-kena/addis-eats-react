import { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext(null);
const STORAGE_KEY = 'addisEats.adminSession';

// Demo-only credential — there's no real backend here, so this exists
// purely to gate the /admin route group, not to secure anything real.
export const ADMIN_USERNAME = 'admin@addiseats.et';
export const ADMIN_PASSWORD = 'admin123';

export function AdminAuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(STORAGE_KEY) === 'true');
  const [error, setError] = useState('');

  function login(username, password) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setIsAdmin(true);
      setError('');
      return true;
    }
    setError('Invalid email or passphrase.');
    return false;
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsAdmin(false);
  }

  return (
    <AdminAuthContext.Provider value={{ isAdmin, error, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used inside an AdminAuthProvider');
  }
  return ctx;
}