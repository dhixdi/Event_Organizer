import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 glow">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-text-base">EventSync</h1>
          <p className="text-muted mt-1">Koordinasi Panitia & Vendor Acara</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-display font-semibold text-text-base mb-6">Masuk ke Akun</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Email</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="admin@eventsync.local" required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-text-base placeholder:text-muted/50 focus:outline-none focus:border-primary/60 focus:bg-white/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Password</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-text-base placeholder:text-muted/50 focus:outline-none focus:border-primary/60 focus:bg-white/10 transition-all"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-primary/80 disabled:opacity-50 rounded-lg font-medium text-white transition-all glow mt-2"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          {/* Demo accounts hint */}
          <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/5">
            <p className="text-xs text-muted font-medium mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs font-mono">
              <p><span className="text-primary">admin</span>@gmail.com / admin123</p>
              <p><span className="text-secondary">ketua</span>@gmail.com / ketua123</p>
              <p><span className="text-accent">staf</span>@gmail.com / staf123</p>
            </div>
          </div>

          {/* Link ke register */}
          <p className="text-center text-sm text-muted mt-4">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary hover:text-secondary transition-colors font-medium">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}