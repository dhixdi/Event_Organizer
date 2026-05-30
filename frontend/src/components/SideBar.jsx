import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Fix #5: Hapus filter roles: [] pada "Tugas Saya"
// Admin/ketua juga bisa jadi assignee tugas, jadi semua role harus bisa akses
const NAV_ITEMS = [
  { to: '/dashboard',          label: 'Dashboard',    icon: '⊞',  roles: [] },
  { to: '/events',             label: 'Events',        icon: '📅', roles: [] },
  { to: '/tugas',               label: 'Tugas Saya',   icon: '✅', roles: [] }, // Fix #5: sudah benar - semua role
  { to: '/users',              label: 'Users',         icon: '👥', roles: ['admin', 'ketua'] },
  { to: '/notifikasi/kirim',   label: 'Kirim Notif',   icon: '📢', roles: ['admin', 'ketua'] },
  { to: '/notifikasi',         label: 'Notifikasi',    icon: '🔔', roles: [] },
  { to: '/profile',            label: 'Profil',        icon: '👤', roles: [] },
];

const ROLE_LABEL = { admin: 'Administrator', ketua: 'Ketua Panitia', staf: 'Staf EO' };
const ROLE_COLOR = {
  admin: 'bg-primary-bg text-primary',
  ketua: 'bg-accent-bg text-accent',
  staf:  'bg-secondary-bg text-secondary-dark',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const visibleNav = NAV_ITEMS.filter(
    n => !n.roles.length || n.roles.includes(user?.role)
  );

  const initials = user?.name
    ?.split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  return (
    <aside className="w-64 shrink-0 min-h-screen bg-surface border-r border-border-light flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border-light">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-primary shrink-0">
            <span className="text-white font-display font-bold text-base">E</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-text-base text-base leading-tight">EventSync</h1>
            <p className="text-[10px] text-text-light font-medium uppercase tracking-wider">Koordinasi Acara</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-light">Menu</p>
        {visibleNav.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            <span className="w-5 text-center text-base">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Fix #1 & #2: Fitur Realtime — semua role bisa akses setelah masuk ke event */}
        <div className="mt-4">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-light">Koordinasi Realtime</p>
          <p className="px-3 py-2 text-xs text-text-muted bg-surface-2 rounded-xl leading-relaxed">
            💬 Chat, ✅ Checklist, 🔄 Perubahan Rundown, dan 📋 Log Koordinasi tersedia di halaman
            <span className="font-semibold text-text-base"> Detail Event</span>.
          </p>
        </div>

        {/* Admin/Ketua: link cepat ke fitur manajemen */}
        {(user?.role === 'admin' || user?.role === 'ketua') && (
          <div className="mt-4">
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-light">Manajemen</p>
            <NavLink
              to="/events"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              <span className="w-5 text-center text-base">⚙️</span>
              <span>Kelola Events</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="px-3 pb-4 border-t border-border-light pt-4 space-y-2">
        <NavLink to="/profile" className="bg-background rounded-2xl p-3 flex items-center gap-3 hover:bg-surface-2 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-primary-bg flex items-center justify-center font-display font-bold text-primary text-sm shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-base truncate">{user?.name}</p>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLOR[user?.role]}`}>
              {ROLE_LABEL[user?.role] || user?.role}
            </span>
          </div>
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-danger/80 hover:bg-danger-bg hover:text-danger transition-colors"
        >
          <span>→</span>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}