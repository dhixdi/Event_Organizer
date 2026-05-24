import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  { label: 'Admin',  email: 'admin@gmail.com',   password: 'admin123',    color: 'text-primary' },
  { label: 'Ketua',  email: 'ketua@gmail.com',   password: 'ketua123',    color: 'text-accent' },
  { label: 'Staf',   email: 'staf@gmail.com',    password: 'staf123',     color: 'text-secondary-dark' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => setForm({ email: acc.email, password: acc.password });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-text-base p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-16 -left-16 w-56 h-56 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute top-1/2 right-8 w-40 h-40 rounded-full bg-secondary/20 blur-2xl" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-primary mb-6">
            <span className="text-white font-display font-bold text-xl">E</span>
          </div>
          <h1 className="font-display font-bold text-white text-2xl">EventSync</h1>
          <p className="text-white/50 text-sm mt-1">Platform Koordinasi Acara</p>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <blockquote className="text-white/90 text-2xl font-display font-semibold leading-relaxed mb-6">
            "Koordinasi panitia yang lebih mudah,<br />
            lebih cepat, lebih rapi."
          </blockquote>
          <div className="flex gap-4">
            {[
              { label: 'Event Berhasil', value: '200+' },
              { label: 'Panitia Aktif',  value: '1K+' },
              { label: 'Tugas Selesai',  value: '98%' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
                <p className="text-primary font-display font-bold text-xl">{s.value}</p>
                <p className="text-white/50 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-white/30 text-xs">© 2026 EventSync. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-primary">
              <span className="text-white font-display font-bold">E</span>
            </div>
            <span className="font-display font-bold text-text-base text-lg">EventSync</span>
          </div>

          <h2 className="font-display font-bold text-text-base text-2xl mb-1">Selamat Datang 👋</h2>
          <p className="text-text-muted text-sm mb-8">Masuk untuk melanjutkan koordinasi acara</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-danger-bg border border-danger/20 text-danger text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="nama@contoh.com" required
                className="input"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" required
                  className="input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-muted text-sm"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary btn-lg w-full mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : 'Masuk Sekarang'}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Daftar di sini
            </Link>
          </p>

          {/* Demo accounts */}
          <div className="mt-8 p-4 rounded-2xl bg-surface-2 border border-border-light">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              🎮 Demo Accounts
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surface transition-colors text-left group"
                >
                  <div>
                    <span className={`text-xs font-bold ${acc.color}`}>{acc.label}</span>
                    <p className="text-xs text-text-light font-mono">{acc.email}</p>
                  </div>
                  <span className="text-xs text-text-light group-hover:text-primary transition-colors">Gunakan →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}