import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';

const ROLES = ['', 'admin', 'ketua', 'staf'];

export default function Users() {
  const { isAdmin } = useAuth();
  const [users, setUsers]     = useState([]);
  const [meta, setMeta]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [role, setRole]       = useState('');

  const fetchUsers = () => {
    setLoading(true);
    userService.list({ page, per_page: 10, q: search || undefined, role: role || undefined })
      .then(res => {
        setUsers(res.data.data.users);
        setMeta(res.data.meta);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page, role]);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchUsers(); }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const handleDeleteUser = async (id, name) => {
    if (!confirm(`Hapus user "${name}"?`)) return;
    try {
      await userService.delete(id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus user');
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await userService.updateRole(id, newRole);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal update role');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-base">Users</h1>
        <p className="text-muted mt-1">Manajemen pengguna sistem</p>
      </div>

      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama atau email..."
          className="flex-1 min-w-48 px-4 py-2 bg-surface border border-white/10 rounded-lg text-sm text-text-base placeholder:text-muted/50 focus:outline-none focus:border-primary/60 transition-all"
        />
        <select
          value={role} onChange={e => { setRole(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-surface border border-white/10 rounded-lg text-sm text-text-base focus:outline-none focus:border-primary/60 transition-all"
        >
          {ROLES.map(r => <option key={r} value={r}>{r || 'Semua Role'}</option>)}
        </select>
      </div>

      {loading ? <Spinner /> : users.length === 0 ? (
        <EmptyState icon="👥" title="Tidak ada user" />
      ) : (
        <div className="grid gap-3">
          {users.map(u => (
            <Card key={u.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-text-base">{u.name}</span>
                      <Badge value={u.role} type="role" />
                      {!u.is_active && <Badge value="nonaktif" />}
                    </div>
                    <p className="text-sm text-muted truncate">{u.email}</p>
                    {u.divisi && <p className="text-xs text-muted/60">{u.divisi}</p>}
                  </div>
                </div>

                {/* Actions — hanya admin */}
                {isAdmin && (
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={u.role}
                      onChange={e => handleChangeRole(u.id, e.target.value)}
                      className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-text-base focus:outline-none"
                    >
                      {['admin', 'ketua', 'staf'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button
                      onClick={() => handleDeleteUser(u.id, u.name)}
                      className="px-3 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded border border-red-500/20 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
}