import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/api.js';

const STORAGE_KEY = 'ai_art_gallery_user';
const AuthContext = createContext(null);

function readStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user?.token),
      async login(credentials) {
        const nextUser = await authApi.login(credentials);
        setUser(nextUser);
        return nextUser;
      },
      async register(payload) {
        const nextUser = await authApi.register(payload);
        setUser(nextUser);
        return nextUser;
      },
      logout() {
        setUser(null);
      }
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
