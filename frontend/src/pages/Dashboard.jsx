import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { formatDate } from '../utils/formatters';

export default function Dashboard() {
  const { user, canManage } = useAuth();
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats]     = useState({ total: 0, aktif: 0, draft: 0, selesai: 0 });

  useEffect(() => {
    eventService.list({ per_page: 100 }).then(res => {
      const data = res.data.data.events;
      setEvents(data);
      setStats({
        total:   data.length,
        aktif:   data.filter(e => e.status === 'aktif').length,
        draft:   data.filter(e => e.status === 'draft').length,
        selesai: data.filter(e => e.status === 'selesai').length,
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const recentEvents = events.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-text-base">
          Selamat datang, <span className="text-primary">{user?.name}</span> 👋
        </h1>
        <p className="text-muted mt-1">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Event',    value: stats.total,   icon: '📅', color: 'text-text-base' },
          { label: 'Aktif',          value: stats.aktif,   icon: '🟢', color: 'text-emerald-400' },
          { label: 'Draft',          value: stats.draft,   icon: '📝', color: 'text-muted' },
          { label: 'Selesai',        value: stats.selesai, icon: '✅', color: 'text-blue-400' },
        ].map(s => (
          <Card key={s.label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">{s.label}</p>
                <p className={`text-3xl font-display font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
              <span className="text-2xl">{s.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-text-base">Event Terbaru</h2>
          <Link to="/events" className="text-sm text-primary hover:text-secondary transition-colors">
            Lihat semua →
          </Link>
        </div>

        <div className="space-y-3">
          {recentEvents.length === 0 ? (
            <Card><p className="text-muted text-sm text-center py-4">Belum ada event</p></Card>
          ) : recentEvents.map(event => (
            <Link key={event.id} to={`/events/${event.id}`}>
              <Card hover>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-text-base truncate">{event.nama_event}</h3>
                      <Badge value={event.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted">
                      <span>📍 {event.lokasi || 'Lokasi belum diset'}</span>
                      <span>📅 {formatDate(event.tanggal_mulai)}</span>
                    </div>
                  </div>
                  <span className="text-muted ml-4">→</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}