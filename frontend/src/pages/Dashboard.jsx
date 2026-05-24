import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import { realtimeService } from '../services/realtimeService';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { formatDate, formatRelative } from '../utils/formatters';

const GREETING = () => {
  const h = new Date().getHours();
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 18) return 'Selamat sore';
  return 'Selamat malam';
};

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div className={`bg-surface rounded-2xl border border-border-light shadow-card p-5 flex items-start gap-4`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-text-base">{value}</p>
        <p className="text-sm text-text-muted">{label}</p>
        {sub && <p className="text-xs text-text-light mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, canManage } = useAuth();
  const [events,  setEvents]  = useState([]);
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      eventService.list({ per_page: 20 }),
      realtimeService.getMyNotifications({ limit: 5 }).catch(() => ({ data: { data: { notifications: [] } } })),
    ]).then(([evRes, nRes]) => {
      setEvents(evRes.data.data.events || []);
      setNotifs(nRes?.data?.data?.notifications || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const stats = {
    total:   events.length,
    aktif:   events.filter(e => e.status === 'aktif').length,
    draft:   events.filter(e => e.status === 'draft').length,
    selesai: events.filter(e => e.status === 'selesai').length,
  };
  const recentEvents   = events.slice(0, 5);
  const activeEvents   = events.filter(e => e.status === 'aktif').slice(0, 3);
  const unreadNotifs   = notifs.filter(n => !n.is_read).length;

  if (loading) return <Spinner size="lg" label="Memuat dashboard..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-base">
            {GREETING()}, <span className="text-primary">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-text-muted text-sm mt-0.5">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        {canManage && (
          <Link to="/events" className="btn-primary btn-sm">
            + Buat Event
          </Link>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Event"  value={stats.total}   icon="📅" color="bg-primary-bg" />
        <StatCard label="Event Aktif"  value={stats.aktif}   icon="🟢" color="bg-success-bg" sub={`${stats.aktif} berjalan`} />
        <StatCard label="Draft"        value={stats.draft}   icon="📝" color="bg-surface-2"  />
        <StatCard label="Selesai"      value={stats.selesai} icon="✅" color="bg-accent-bg"  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Event Terbaru</h2>
            <Link to="/events" className="text-sm text-primary font-medium hover:underline">
              Lihat semua →
            </Link>
          </div>

          <div className="space-y-3">
            {recentEvents.length === 0 ? (
              <div className="bg-surface rounded-2xl border border-border-light p-8 text-center">
                <p className="text-4xl mb-3">📅</p>
                <p className="text-text-muted text-sm">Belum ada event. Buat event pertama!</p>
                {canManage && (
                  <Link to="/events" className="btn-primary btn-sm mt-4 inline-flex">
                    + Buat Event
                  </Link>
                )}
              </div>
            ) : recentEvents.map(event => (
              <Link key={event.id} to={`/events/${event.id}`}
                className="bg-surface border border-border-light rounded-2xl p-4 flex items-center gap-4 hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 block">
                {/* Color bar */}
                <div className={`w-1.5 h-12 rounded-full shrink-0 ${
                  event.status === 'aktif' ? 'bg-success' :
                  event.status === 'draft' ? 'bg-text-light' :
                  event.status === 'selesai' ? 'bg-accent' : 'bg-danger'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-semibold text-text-base text-sm truncate">{event.nama_event}</span>
                    <Badge value={event.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
                    {event.lokasi && <span>📍 {event.lokasi}</span>}
                    <span>📅 {formatDate(event.tanggal_mulai)}</span>
                    {event.ketua && <span>👤 {event.ketua.name}</span>}
                  </div>
                </div>
                <span className="text-text-light shrink-0">›</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Notifications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Notifikasi</h2>
              {unreadNotifs > 0 && (
                <span className="pill bg-primary-bg text-primary border border-primary/20">
                  {unreadNotifs} baru
                </span>
              )}
            </div>
            <div className="bg-surface rounded-2xl border border-border-light overflow-hidden">
              {notifs.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-2xl mb-2">🔔</p>
                  <p className="text-sm text-text-muted">Tidak ada notifikasi</p>
                </div>
              ) : notifs.map((n, i) => (
                <div key={n.id || i}
                  className={`p-3.5 flex items-start gap-3 border-b border-border-light last:border-0 ${!n.is_read ? 'bg-primary-bg/30' : ''}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.is_read ? 'bg-primary' : 'bg-border'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-base truncate">{n.judul}</p>
                    <p className="text-xs text-text-muted line-clamp-2 mt-0.5">{n.pesan}</p>
                    <p className="text-[10px] text-text-light mt-1">{formatRelative(n.created_at)}</p>
                  </div>
                </div>
              ))}
              <Link to="/notifikasi"
                className="block text-center text-xs text-primary py-3 hover:bg-primary-bg/30 transition-colors font-medium">
                Lihat semua notifikasi →
              </Link>
            </div>
          </div>

          {/* Active Events quick links */}
          {activeEvents.length > 0 && (
            <div>
              <h2 className="section-title mb-3">Event Aktif</h2>
              <div className="space-y-2">
                {activeEvents.map(e => (
                  <Link key={e.id} to={`/events/${e.id}`}
                    className="flex items-center gap-3 bg-surface border border-border-light rounded-xl px-4 py-3 hover:shadow-card-md transition-all">
                    <div className="w-2 h-2 rounded-full bg-success shrink-0 animate-pulse-soft" />
                    <span className="text-sm font-medium text-text-base truncate flex-1">{e.nama_event}</span>
                    <span className="text-xs text-text-muted">{formatDate(e.tanggal_mulai)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}