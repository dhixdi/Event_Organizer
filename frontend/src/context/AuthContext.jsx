import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); }
    catch { return null; }
  });
  const [token, setToken]     = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Verifikasi token saat mount
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    authService.me()
      .then(res => setUser(res.data.data.user))
      .catch(() => { logout(); })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res  = await authService.login({ email, password });
    const { token: tk, user: u } = res.data.data;
    localStorage.setItem('token', tk);
    localStorage.setItem('user', JSON.stringify(u));
    setToken(tk);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const isAdmin  = user?.role === 'admin';
  const isKetua  = user?.role === 'ketua';
  const isStaf   = user?.role === 'staf';
  const canManage = isAdmin || isKetua;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isKetua, isStaf, canManage }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};