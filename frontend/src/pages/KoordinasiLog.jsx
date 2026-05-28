import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { realtimeService } from '../services/realtimeService';
import { eventService } from '../services/eventService';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { formatDateTime, formatRelative } from '../utils/formatters';

const ENTITY_ICONS = {
  tugas: '✅',
  vendor: '🏢',
  rundown: '📋',
  event: '📅',
};

const ENTITY_COLORS = {
  tugas: 'bg-primary-bg text-primary border-primary/20',
  vendor: 'bg-accent-bg text-accent border-accent/20',
  rundown: 'bg-secondary-bg text-secondary-dark border-secondary/30',
  event: 'bg-success-bg text-success border-success/20',
};

const POLL_INTERVAL = 15000;

export default function KoordinasiLog() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { canManage } = useAuth();

  const [event, setEvent] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  const fetchLogs = useCallback(async (silent = false) => {
    try {
      const res = await realtimeService.getLogsByEvent(eventId);
      setLogs(res.data.data.logs || []);
      if (!silent) setLoading(false);
    } catch {
      if (!silent) setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (!canManage) {
      navigate('/dashboard');
      return;
    }
    eventService.getById(eventId)
      .then(r => setEvent(r.data.data.event))
      .catch(() => navigate('/events'));
    fetchLogs(false);
    const timer = setInterval(() => fetchLogs(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchLogs, eventId, canManage, navigate]);

  const filtered = logs.filter(log => {
    const matchEntity = !entityFilter || log.entity === entityFilter;
    const matchSearch = !filter ||
      log.aksi?.toLowerCase().includes(filter.toLowerCase()) ||
      log.entity?.toLowerCase().includes(filter.toLowerCase());
    return matchEntity && matchSearch;
  });

  const entities = [...new Set(logs.map(l => l.entity).filter(Boolean))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-text-muted hover:text-text-base transition-colors">←</button>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-text-base">Log Koordinasi</h1>
          {event && <p className="text-text-muted text-sm">{event.nama_event}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['tugas', 'vendor', 'rundown', 'event'].map(entity => {
          const count = logs.filter(l => l.entity === entity).length;
          return (
            <div key={entity}
              onClick={() => setEntityFilter(prev => prev === entity ? '' : entity)}
              className={`bg-surface rounded-2xl border shadow-card p-4 cursor-pointer transition-all ${
                entityFilter === entity ? 'border-primary shadow-primary/20' : 'border-border-light hover:shadow-card-md'
              }`}>
              <div className="text-2xl mb-1">{ENTITY_ICONS[entity]}</div>
              <p className="text-2xl font-display font-bold text-text-base">{count}</p>
              <p className="text-xs text-text-muted capitalize">{entity}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light text-sm">🔍</span>
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Cari aksi atau entity..."
            className="input pl-9"
          />
        </div>
        <select
          value={entityFilter}
          onChange={e => setEntityFilter(e.target.value)}
          className="input w-auto"
        >
          <option value="">Semua Entity</option>
          {entities.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        {(filter || entityFilter) && (
          <button onClick={() => { setFilter(''); setEntityFilter(''); }} className="btn-ghost btn-sm">
            Reset
          </button>
        )}
      </div>

      {/* Log count */}
      {!loading && (
        <p className="text-sm text-text-muted">
          Menampilkan <span className="font-medium text-text-base">{filtered.length}</span> dari{' '}
          <span className="font-medium text-text-base">{logs.length}</span> log
        </p>
      )}

      {/* Logs */}
      {loading ? (
        <Spinner label="Memuat log koordinasi..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Belum ada log koordinasi"
          desc="Aktivitas koordinasi akan tercatat otomatis di sini."
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((log, i) => (
            <div key={log.id || i} className="bg-surface rounded-2xl border border-border-light shadow-card p-4">
              <div className="flex items-start gap-3">
                {/* Timeline dot */}
                <div className="flex flex-col items-center shrink-0 mt-1">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base border ${
                    ENTITY_COLORS[log.entity] || 'bg-border-light text-text-muted border-border'
                  }`}>
                    {ENTITY_ICONS[log.entity] || '📝'}
                  </div>
                  {i < filtered.length - 1 && (
                    <div className="w-px h-4 bg-border-light mt-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`pill text-[10px] border ${ENTITY_COLORS[log.entity] || 'bg-border-light text-text-muted border-border'}`}>
                      {log.entity}
                    </span>
                    <span className="text-sm font-semibold text-text-base">{log.aksi}</span>
                  </div>
                  {log.detail && Object.keys(log.detail).length > 0 && (
                    <div className="text-xs text-text-muted bg-surface-2 rounded-lg px-3 py-2 mb-2 font-mono">
                      {JSON.stringify(log.detail, null, 0)}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-text-light flex-wrap">
                    <span>🆔 Entity #{log.entity_id}</span>
                    {log.user_id && <span>👤 User #{log.user_id}</span>}
                    {log.ip_address && <span>🌐 {log.ip_address}</span>}
                    <span title={formatDateTime(log.timestamp)}>{formatRelative(log.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-text-light text-center">
        🔄 Data diperbarui otomatis setiap 15 detik
      </p>
    </div>
  );
}