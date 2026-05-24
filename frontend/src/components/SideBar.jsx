import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: '⚡', roles: [] },
  { to: '/events',    label: 'Events',    icon: '📅', roles: [] },
  { to: '/users',     label: 'Users',     icon: '👥', roles: ['admin', 'ketua'] },
];

export default function Sidebar() {
  const { user, logout, canManage } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const visibleNav = NAV.filter(n => !n.roles.length || n.roles.includes(user?.role));

  return (
    <aside className="w-64 min-h-screen glass border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center glow">
            <span className="text-lg">⚡</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-text-base">EventSync</h1>
            <p className="text-xs text-muted">Koordinasi Panitia</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {visibleNav.map(({ to, label, icon }) => (
          <NavLink
            key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white glow'
                  : 'text-muted hover:text-text-base hover:bg-white/5'
              }`
            }
          >
            <span>{icon}</span>{label}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-sm font-bold text-primary">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-base truncate">{user?.name}</p>
            <p className="text-xs text-muted capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
        >
          → Logout
        </button>
      </div>
    </aside>
  );
}