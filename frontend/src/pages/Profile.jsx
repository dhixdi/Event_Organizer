import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { useToast } from '../components/ui/Toast';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/formatters';

const DIVISI_OPTIONS = [
  'Dekorasi', 'Catering', 'Sound System', 'Dokumentasi',
  'Keamanan', 'Transportasi', 'Perlengkapan', 'Acara', 'Humas', 'Panitia Inti', 'Admin',
];

export default function Profile() {
  const { user, logout } = useAuth();
  const toast = useToast();

  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    name:   user?.name   || '',
    phone:  user?.phone  || '',
    divisi: user?.divisi || '',
  });

  const initials = user?.name
    ?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.update(user.id, form);
      // Refresh user data from server
      const res = await authService.me();
      // Update localStorage so next load gets fresh data
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      toast('Profil berhasil diupdate!', 'success');
      setEditing(false);
      // Force reload to reflect changes in AuthContext
      window.location.reload();
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal update profil', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name:   user?.name   || '',
      phone:  user?.phone  || '',
      divisi: user?.divisi || '',
    });
    setEditing(false);
  };

  const handleLogout = async () => {
    if (!confirm('Yakin ingin keluar?')) return;
    await logout();
  };

  const ROLE_LABEL = { admin: 'Administrator', ketua: 'Ketua Panitia', staf: 'Staf EO' };
  const ROLE_COLOR = {
    admin: 'bg-primary-bg text-primary border border-primary/20',
    ketua: 'bg-accent-bg text-accent border border-accent/20',
    staf:  'bg-secondary-bg text-secondary-dark border border-secondary/30',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-text-base">Profil Saya</h1>
        <p className="text-text-muted text-sm mt-0.5">Informasi akun dan preferensi</p>
      </div>

      {/* Avatar + Info Card */}
      <div className="bg-surface rounded-2xl border border-border-light shadow-card p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-bg flex items-center justify-center font-display font-bold text-primary text-2xl shrink-0 shadow-primary">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-text-base">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`pill text-xs font-semibold ${ROLE_COLOR[user?.role]}`}>
                {ROLE_LABEL[user?.role] || user?.role}
              </span>
              {user?.divisi && (
                <span className="text-xs text-text-muted bg-surface-2 px-2 py-0.5 rounded-full">
                  {user.divisi}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info rows */}
        {!editing ? (
          <div className="space-y-3">
            {[
              { icon: '✉️', label: 'Email', value: user?.email },
              { icon: '📞', label: 'Telepon', value: user?.phone || '—' },
              { icon: '🏷️', label: 'Divisi', value: user?.divisi || '—' },
              { icon: '📅', label: 'Bergabung', value: formatDate(user?.created_at) },
              { icon: '🔵', label: 'Status', value: user?.is_active ? 'Aktif' : 'Nonaktif' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 py-2 border-b border-border-light last:border-0">
                <span className="w-8 text-center text-base">{icon}</span>
                <span className="text-sm text-text-muted w-24 shrink-0">{label}</span>
                <span className="text-sm text-text-base font-medium">{value}</span>
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setEditing(true)}
                className="btn-primary btn-sm"
              >
                ✏️ Edit Profil
              </button>
              <button
                onClick={handleLogout}
                className="btn-danger btn-sm"
              >
                → Keluar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label">Nama Lengkap *</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                required
                className="input"
                placeholder="Nama lengkap"
              />
            </div>
            <div>
              <label className="label">No. Telepon</label>
              <input
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="input"
                placeholder="08xx"
              />
            </div>
            <div>
              <label className="label">Divisi</label>
              <select
                value={form.divisi}
                onChange={e => setForm(p => ({ ...p, divisi: e.target.value }))}
                className="input"
              >
                <option value="">— Pilih Divisi —</option>
                {DIVISI_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="text-xs text-text-muted bg-surface-2 p-3 rounded-xl">
              ⚠️ Email dan role hanya dapat diubah oleh Admin.
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={handleCancel} className="btn-ghost flex-1">
                Batal
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menyimpan...
                  </span>
                ) : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Info Akun */}
      <div className="bg-surface rounded-2xl border border-border-light shadow-card p-6">
        <h3 className="font-display font-semibold text-text-base mb-4">Info Akun</h3>
        <div className="space-y-2 text-sm text-text-muted">
          <p>🔐 Token JWT berlaku selama 24 jam. Setelah itu Anda perlu login ulang.</p>
          <p>📱 Untuk akses mobile, gunakan aplikasi EventSync Mobile dengan akun yang sama.</p>
          {user?.role === 'staf' && (
            <p>💡 Sebagai Staf EO, Anda hanya dapat melihat event yang Anda memiliki tugas di dalamnya.</p>
          )}
        </div>
      </div>
    </div>
  );
}