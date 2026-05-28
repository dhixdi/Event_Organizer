import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { realtimeService } from '../services/realtimeService';
import { eventService } from '../services/eventService';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { formatRelative, formatDateTime } from '../utils/formatters';

const POLL_INTERVAL = 10000;

const FIELD_LABELS = {
  status: 'Status',
  judul_sesi: 'Judul Sesi',
  waktu_mulai: 'Waktu Mulai',
  waktu_selesai: 'Waktu Selesai',
  deskripsi: 'Deskripsi',
  pic_id: 'PIC',
  vendor_id: 'Vendor',
  urutan: 'Urutan',
};

export default function RundownChanges() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { canManage } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    rundown_id: '',
    field_berubah: 'status',
    nilai_lama: '',
    nilai_baru: '',
    alasan: '',
  });

  const fetchChanges = useCallback(async (silent = false) => {
    try {
      const res = await realtimeService.getRundownChanges(eventId);
      setChanges(res.data.data.changes || []);
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
    fetchChanges(false);
    const timer = setInterval(() => fetchChanges(true), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchChanges, eventId, canManage, navigate]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.rundown_id || !form.nilai_baru) {
      toast('Rundown ID dan nilai baru wajib diisi', 'error');
      return;
    }
    setSaving(true);
    try {
      await realtimeService.createRundownChange({
        rundown_id: parseInt(form.rundown_id),
        event_id: parseInt(eventId),
        field_berubah: form.field_berubah,
        nilai_lama: form.nilai_lama || null,
        nilai_baru: form.nilai_baru,
        alasan: form.alasan || null,
      });
      toast('Perubahan rundown berhasil dicatat!', 'success');
      setShowCreateForm(false);
      setForm({ rundown_id: '', field_berubah: 'status', nilai_lama: '', nilai_baru: '', alasan: '' });
      fetchChanges(true);
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal mencatat perubahan', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-text-muted hover:text-text-base transition-colors">←</button>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-text-base">Perubahan Rundown</h1>
          {event && <p className="text-text-muted text-sm">{event.nama_event}</p>}
        </div>
        {canManage && (
          <button onClick={() => setShowCreateForm(s => !s)} className="btn-primary btn-sm">
            + Catat Perubahan
          </button>
        )}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface rounded-2xl border border-border-light shadow-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-primary">{changes.length}</p>
          <p className="text-xs text-text-muted">Total Perubahan</p>
        </div>
        <div className="bg-surface rounded-2xl border border-border-light shadow-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-accent">
            {new Set(changes.map(c => c.rundown_id)).size}
          </p>
          <p className="text-xs text-text-muted">Rundown Berubah</p>
        </div>
        <div className="bg-surface rounded-2xl border border-border-light shadow-card p-4 text-center">
          <p className="text-2xl font-display font-bold text-secondary-dark">
            {changes.filter(c => {
              const t = new Date(c.timestamp);
              const now = new Date();
              return (now - t) < 3600000;
            }).length}
          </p>
          <p className="text-xs text-text-muted">1 Jam Terakhir</p>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && canManage && (
        <div className="bg-surface rounded-2xl border border-primary/30 shadow-card p-5">
          <h3 className="font-semibold text-text-base mb-4">Catat Perubahan Rundown</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">ID Rundown *</label>
                <input
                  type="number" value={form.rundown_id} required className="input"
                  onChange={e => setForm(p => ({ ...p, rundown_id: e.target.value }))}
                  placeholder="ID sesi rundown"
                />
              </div>
              <div>
                <label className="label">Field yang Berubah</label>
                <select value={form.field_berubah} className="input"
                  onChange={e => setForm(p => ({ ...p, field_berubah: e.target.value }))}>
                  {Object.entries(FIELD_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Nilai Lama</label>
                <input value={form.nilai_lama} className="input"
                  onChange={e => setForm(p => ({ ...p, nilai_lama: e.target.value }))}
                  placeholder="Nilai sebelum perubahan" />
              </div>
              <div>
                <label className="label">Nilai Baru *</label>
                <input value={form.nilai_baru} required className="input"
                  onChange={e => setForm(p => ({ ...p, nilai_baru: e.target.value }))}
                  placeholder="Nilai setelah perubahan" />
              </div>
            </div>
            <div>
              <label className="label">Alasan Perubahan</label>
              <input value={form.alasan} className="input"
                onChange={e => setForm(p => ({ ...p, alasan: e.target.value }))}
                placeholder="Mengapa rundown diubah?" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowCreateForm(false)} className="btn-ghost flex-1">Batal</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'Menyimpan...' : 'Catat Perubahan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Changes Timeline */}
      {loading ? (
        <Spinner label="Memuat perubahan rundown..." />
      ) : changes.length === 0 ? (
        <EmptyState
          icon="🔄"
          title="Belum ada perubahan rundown"
          desc="Setiap perubahan rundown yang dicatat akan muncul di sini secara realtime."
        />
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border-light" />
          <div className="space-y-4">
            {changes.map((change, i) => (
              <div key={change.id || i} className="relative flex gap-4">
                {/* Timeline node */}
                <div className="shrink-0 w-10 h-10 rounded-full bg-surface border-2 border-accent flex items-center justify-center text-sm z-10">
                  🔄
                </div>
                <div className="flex-1 bg-surface rounded-2xl border border-border-light shadow-card p-4 mb-1">
                  <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                    <div>
                      <span className="font-semibold text-text-base">
                        Rundown #{change.rundown_id}
                      </span>
                      <span className="mx-2 text-text-light">•</span>
                      <span className="text-sm text-text-muted">
                        {FIELD_LABELS[change.field_berubah] || change.field_berubah}
                      </span>
                    </div>
                    <span className="text-xs text-text-light" title={formatDateTime(change.timestamp)}>
                      {formatRelative(change.timestamp)}
                    </span>
                  </div>

                  {/* Before → After */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {change.nilai_lama && (
                      <>
                        <span className="px-3 py-1 bg-danger-bg text-danger border border-danger/20 rounded-lg text-sm font-mono line-through">
                          {change.nilai_lama}
                        </span>
                        <span className="text-text-muted">→</span>
                      </>
                    )}
                    <span className="px-3 py-1 bg-success-bg text-success border border-success/20 rounded-lg text-sm font-mono font-medium">
                      {change.nilai_baru}
                    </span>
                  </div>

                  {change.alasan && (
                    <div className="bg-surface-2 rounded-xl px-3 py-2 text-sm text-text-muted">
                      💬 <span className="italic">{change.alasan}</span>
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-3 text-xs text-text-light">
                    {change.diubah_oleh && <span>👤 User #{change.diubah_oleh}</span>}
                    <span>{formatDateTime(change.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-text-light text-center">
        🔄 Diperbarui otomatis setiap 10 detik
      </p>
    </div>
  );
}