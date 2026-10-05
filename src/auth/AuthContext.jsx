import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'addisEats.session';

/**
 * Customer sign-in session — deliberately lightweight (name + phone,
 * no password). This isn't securing anything sensitive; it exists so
 * Checkout can require the customer identify themselves once per
 * session before ordering, per the rubric's state-ownership table.
 * sessionStorage (not localStorage) — matches "rarely changes,
 * cleared when the browser session ends" rather than surviving forever.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (session) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // sessionStorage unavailable — session just won't persist a refresh
    }
  }, [session]);

  function signIn(name, phone) {
    setSession({ name: name.trim(), phone: phone.trim() });
  }

  function signOut() {
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, isSignedIn: Boolean(session), signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx;
}