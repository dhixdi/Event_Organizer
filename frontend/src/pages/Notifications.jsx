import { useState, useEffect } from 'react';
import { realtimeService } from '../services/realtimeService';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { formatDateTime } from '../utils/formatters';

const TIPE_ICONS = {
  tugas:   '✅',
  rundown: '📋',
  vendor:  '🏢',
  sistem:  '⚙️',
};

export default function Notifications() {
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    realtimeService.listMyNotifications()
      .then(res => setNotifs(res.data.data.notifications))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
    // Poll tiap 30 detik
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await realtimeService.markNotifRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifs.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-base">Notifikasi</h1>
          <p className="text-muted mt-1">
            {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => notifs.filter(n => !n.is_read).forEach(n => handleMarkRead(n.id))}
            className="text-sm text-primary hover:text-secondary transition-colors"
          >
            Tandai semua dibaca
          </button>
        )}
      </div>

      {loading ? <Spinner /> : notifs.length === 0 ? (
        <EmptyState icon="🔔" title="Belum ada notifikasi" desc="Notifikasi akan muncul di sini" />
      ) : (
        <div className="space-y-3">
          {notifs.map(n => (
            <Card
              key={n.id}
              className={!n.is_read ? 'border-primary/30 bg-primary/5' : ''}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl shrink-0">{TIPE_ICONS[n.tipe] || '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-text-base">{n.judul}</h3>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted mb-2">{n.pesan}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted/60">{formatDateTime(n.created_at)}</span>
                    {!n.is_read && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="text-xs text-primary hover:text-secondary transition-colors"
                      >
                        Tandai dibaca
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}