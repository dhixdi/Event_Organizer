import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const DIVISI_OPTIONS = ['Dekorasi', 'Catering', 'Sound System', 'Dokumentasi', 'Keamanan', 'Transportasi', 'Perlengkapan', 'Acara', 'Humas'];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', divisi: '', phone: '',
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await authService.register({ ...form, role: 'staf' });
      setSuccess('Akun berhasil dibuat! Silakan login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-primary">
            <span className="text-white font-display font-bold">E</span>
          </div>
          <span className="font-display font-bold text-text-base text-lg">EventSync</span>
        </div>

        <div className="bg-surface rounded-3xl shadow-card-lg border border-border-light p-8">
          <h2 className="font-display font-bold text-text-base text-2xl mb-1">Buat Akun Baru</h2>
          <p className="text-text-muted text-sm mb-6">Daftar sebagai Staf EO untuk mulai berkoordinasi</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-danger-bg border border-danger/20 text-danger text-sm">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-success-bg border border-success/20 text-success text-sm">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nama Lengkap *</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="John Doe" required className="input" />
            </div>

            <div>
              <label className="label">Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="john@contoh.com" required className="input" />
            </div>

            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password" value={form.password} onChange={handleChange}
                  placeholder="Min. 6 karakter" required minLength={6}
                  className="input pr-12"
                />
                <button type="button" onClick={() => setShowPass(s=>!s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-muted text-sm">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Divisi</label>
                <select name="divisi" value={form.divisi} onChange={handleChange} className="input">
                  <option value="">Pilih divisi</option>
                  {DIVISI_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="label">No. Telepon</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  placeholder="08xx" className="input" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary btn-lg w-full mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mendaftarkan...
                </span>
              ) : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-4">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}