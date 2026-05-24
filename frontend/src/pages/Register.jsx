import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', divisi: '', phone: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.register({ ...form, role: 'staf' });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 glow">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-text-base">EventSync</h1>
          <p className="text-muted mt-1">Daftar sebagai Staf EO</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-display font-semibold text-text-base mb-6">Buat Akun</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'name',     label: 'Nama Lengkap', type: 'text',     required: true,  placeholder: 'John Doe' },
              { name: 'email',    label: 'Email',        type: 'email',    required: true,  placeholder: 'john@example.com' },
              { name: 'password', label: 'Password',     type: 'password', required: true,  placeholder: 'Min. 6 karakter' },
              { name: 'divisi',   label: 'Divisi',       type: 'text',     required: false, placeholder: 'Contoh: Sound System' },
              { name: 'phone',    label: 'No. Telepon',  type: 'tel',      required: false, placeholder: '08xxxxxxxxxx' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-muted mb-1.5">
                  {f.label} {!f.required && <span className="text-muted/50">(opsional)</span>}
                </label>
                <input
                  type={f.type} name={f.name} value={form[f.name]}
                  onChange={handleChange} required={f.required}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-text-base placeholder:text-muted/50 focus:outline-none focus:border-primary/60 focus:bg-white/10 transition-all"
                />
              </div>
            ))}

            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-primary/80 disabled:opacity-50 rounded-lg font-medium text-white transition-all glow mt-2"
            >
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary hover:text-secondary transition-colors font-medium">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}