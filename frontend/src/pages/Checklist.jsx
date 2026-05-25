import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { realtimeService } from '../services/realtimeService';
import { eventService } from '../services/eventService';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { formatRelative } from '../utils/formatters';

const POLL_INTERVAL = 10000;

const STATUS_COLORS = {
  belum:      'bg-border-light text-text-muted border-border',
  proses:     'bg-secondary-bg text-secondary-dark border-secondary/30',
  selesai:    'bg-success-bg text-success border-success/20',
  terkendala: 'bg-danger-bg text-danger border-danger/20',
};

const STATUS_ICONS = { belum: '⏳', proses: '🔄', selesai: '✅', terkendala: '⚠️' };

function ChecklistCard({ item, onStatusUpdate, canEdit }) {
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (newStatus) => {
    setUpdating(true);
    await onStatusUpdate(item.id, newStatus, item.catatan);
    setUpdating(false);
  };

  return (
    <div className={`bg-surface rounded-2xl border p-4 transition-all ${
      item.status === 'terkendala' ? 'border-danger/30' :
      item.status === 'selesai'   ? 'border-success/30' : 'border-border-light'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${STATUS_COLORS[item.status]}`}>
          {STATUS_ICONS[item.status]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-semibold text-text-base">Tugas #{item.tugas_id}</span>
            <span className={`pill text-[10px] border ${STATUS_COLORS[item.status]}`}>
              {item.status}
            </span>
          </div>
          {item.catatan && (
            <p className="text-xs text-text-muted mb-2">📝 {item.catatan}</p>
          )}
          <p className="text-[10px] text-text-light">
            Update: {formatRelative(item.updated_at)}
            {item.location?.lat && ` • 📍 ${item.location.lat.toFixed(4)}, ${item.location.lng.toFixed(4)}`}
          </p>
        </div>

        {canEdit && (
          <select
            value={item.status}
            disabled={updating}
            onChange={e => handleUpdate(e.target.value)}
            className="px-2 py-1 bg-surface-2 border border-border rounded-lg text-xs text-text-base focus:outline-none focus:ring-2 focus:ring-primary/30 shrink-0"
          >
            {['belum', 'proses', 'selesai', 'terkendala'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

export default function Checklist() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, canManage } = useAuth();
  const toast = useToast();

  const [event,     setEvent]     = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState({ tugas_id: '', status: 'belum', catatan: '' });
  const [saving,    setSaving]    = useState(false);

  const fetchChecklist = useCallback(async (silent = false) => {
    try {
      const res = await realtimeService.getChecklistByEvent(eventId);
      setChecklist(res.data.data.checklist || []);
      if (!silent) setLoading(false);
    } catch {
      if (!silent) setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    eventService.getById(eventId)
      .then(r => setEvent(r.data.data.event))
      .catch(() => navigate('/events'));
    fetchChecklist(false);
    const timer = setInterval(() => fetchChecklist(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchChecklist, eventId]);

  const handleStatusUpdate = async (id, newStatus, catatan) => {
    try {
      await realtimeService.updateChecklistStatus(id, { status: newStatus, catatan });
      await fetchChecklist(true);
      toast('Status checklist diperbarui', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal update status', 'error');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.tugas_id) { toast('ID Tugas wajib diisi', 'error'); return; }
    setSaving(true);
    try {
      await realtimeService.createChecklist({
        tugas_id: parseInt(form.tugas_id),
        event_id: parseInt(eventId),
        user_id:  user.id,
        status:   form.status,
        catatan:  form.catatan || null,
      });
      toast('Checklist berhasil dibuat!', 'success');
      setShowForm(false);
      setForm({ tugas_id: '', status: 'belum', catatan: '' });
      fetchChecklist(true);
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal membuat checklist', 'error');
    } finally { setSaving(false); }
  };

  // Stats
  const total     = checklist.length;
  const selesai   = checklist.filter(c => c.status === 'selesai').length;
  const terkendala = checklist.filter(c => c.status === 'terkendala').length;
  const pct       = total > 0 ? Math.round((selesai / total) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-text-muted hover:text-text-base transition-colors">←</button>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-text-base">Checklist Realtime</h1>
          {event && <p className="text-text-muted text-sm">{event.nama_event}</p>}
        </div>
        {canManage && (
          <button onClick={() => setShowForm(s => !s)} className="btn-primary btn-sm">
            + Tambah
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="bg-surface rounded-2xl border border-border-light shadow-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-text-base">Progress Penyelesaian</span>
            <span className="text-2xl font-display font-bold text-primary">{pct}%</span>
          </div>
          <div className="h-3 bg-border-light rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex gap-4 mt-3 text-xs text-text-muted">
            <span>✅ Selesai: <strong className="text-success">{selesai}</strong></span>
            <span>⚠️ Terkendala: <strong className="text-danger">{terkendala}</strong></span>
            <span>📋 Total: <strong className="text-text-base">{total}</strong></span>
          </div>
        </div>
      )}

      {/* Create form */}
      {showForm && canManage && (
        <div className="bg-surface rounded-2xl border border-primary/30 shadow-card p-5">
          <h3 className="font-semibold text-text-base mb-4">Tambah Checklist Item</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">ID Tugas *</label>
                <input
                  type="number" value={form.tugas_id} required className="input"
                  onChange={e => setForm(p => ({ ...p, tugas_id: e.target.value }))}
                  placeholder="ID tugas"
                />
              </div>
              <div>
                <label className="label">Status Awal</label>
                <select value={form.status} className="input"
                  onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  {['belum', 'proses', 'selesai', 'terkendala'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Catatan</label>
              <input value={form.catatan} className="input"
                onChange={e => setForm(p => ({ ...p, catatan: e.target.value }))}
                placeholder="Catatan opsional" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Batal</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'Menyimpan...' : 'Tambah'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? <Spinner label="Memuat checklist..." /> : checklist.length === 0 ? (
        <EmptyState
          icon="☑️"
          title="Belum ada checklist"
          desc="Checklist realtime akan muncul saat staf memperbarui status tugas."
        />
      ) : (
        <div className="space-y-3">
          {checklist.map(item => (
            <ChecklistCard
              key={item.id}
              item={item}
              canEdit={canManage || user?.id === item.user_id}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-text-light text-center">
        🔄 Data diperbarui otomatis setiap 10 detik
      </p>
    </div>
  );
}