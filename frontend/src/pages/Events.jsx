import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { formatDate } from '../utils/formatters';

const STATUSES = ['', 'draft', 'aktif', 'selesai', 'batal'];

function EventCard({ event }) {
  const colorBar = {
    aktif:   'bg-success',
    draft:   'bg-text-light',
    selesai: 'bg-accent',
    batal:   'bg-danger',
  }[event.status] || 'bg-border';

  return (
    <Link to={`/events/${event.id}`}
      className="block bg-surface border border-border-light rounded-2xl p-5 hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start gap-4">
        <div className={`w-1.5 rounded-full shrink-0 self-stretch ${colorBar}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-display font-semibold text-text-base group-hover:text-primary transition-colors truncate">
              {event.nama_event}
            </h3>
            <Badge value={event.status} />
          </div>
          {event.deskripsi && (
            <p className="text-sm text-text-muted line-clamp-1 mb-3">{event.deskripsi}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap">
            {event.lokasi && (
              <span className="flex items-center gap-1">📍 {event.lokasi}</span>
            )}
            <span className="flex items-center gap-1">
              📅 {formatDate(event.tanggal_mulai)} — {formatDate(event.tanggal_selesai)}
            </span>
            {event.ketua && (
              <span className="flex items-center gap-1">👤 {event.ketua.name}</span>
            )}
          </div>
        </div>
        <span className="text-text-light group-hover:text-primary transition-colors shrink-0">›</span>
      </div>
    </Link>
  );
}

const INITIAL_FORM = {
  nama_event: '', deskripsi: '', lokasi: '',
  tanggal_mulai: '', tanggal_selesai: '', status: 'draft',
};

export default function Events() {
  const { canManage } = useAuth();
  const toast         = useToast();

  const [events,  setEvents]  = useState([]);
  const [meta,    setMeta]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState('');
  const [status,  setStatus]  = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form,    setForm]    = useState(INITIAL_FORM);
  const [saving,  setSaving]  = useState(false);

  const fetchEvents = useCallback(() => {
    setLoading(true);
    eventService.list({
      page, per_page: 10,
      q: search || undefined,
      status: status || undefined,
    }).then(res => {
      setEvents(res.data.data.events || []);
      setMeta(res.data.meta);
    }).catch(console.error).finally(() => setLoading(false));
  }, [page, status]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchEvents(); }, 450);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await eventService.create(form);
      toast('Event berhasil dibuat!', 'success');
      setShowModal(false);
      setForm(INITIAL_FORM);
      setPage(1);
      fetchEvents();
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal membuat event', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-base">Events</h1>
          <p className="text-text-muted text-sm mt-0.5">Kelola semua event koordinasi panitia</p>
        </div>
        {canManage && (
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + Buat Event
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light text-sm">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari event..."
            className="input pl-9"
          />
        </div>
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="input w-auto"
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Semua Status'}</option>
          ))}
        </select>
      </div>

      {/* Event count */}
      {meta && !loading && (
        <p className="text-sm text-text-muted">
          Menampilkan <span className="font-medium text-text-base">{events.length}</span> dari{' '}
          <span className="font-medium text-text-base">{meta.total}</span> event
        </p>
      )}

      {/* List */}
      {loading ? (
        <Spinner label="Memuat events..." />
      ) : events.length === 0 ? (
        <EmptyState
          icon="📅"
          title="Belum ada event"
          desc="Buat event pertama untuk mulai koordinasi panitia dan vendor."
          action={canManage && (
            <button onClick={() => setShowModal(true)} className="btn-primary btn-sm">
              + Buat Event
            </button>
          )}
        />
      ) : (
        <div className="space-y-3">
          {events.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />

      {/* Create Event Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Buat Event Baru" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Nama Event *</label>
            <input
              value={form.nama_event}
              onChange={e => setForm(p => ({ ...p, nama_event: e.target.value }))}
              placeholder="Masukkan nama event" required className="input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Tanggal Mulai *</label>
              <input type="date"
                value={form.tanggal_mulai}
                onChange={e => setForm(p => ({ ...p, tanggal_mulai: e.target.value }))}
                required className="input"
              />
            </div>
            <div>
              <label className="label">Tanggal Selesai *</label>
              <input type="date"
                value={form.tanggal_selesai}
                onChange={e => setForm(p => ({ ...p, tanggal_selesai: e.target.value }))}
                required className="input"
              />
            </div>
          </div>
          <div>
            <label className="label">Lokasi</label>
            <input
              value={form.lokasi}
              onChange={e => setForm(p => ({ ...p, lokasi: e.target.value }))}
              placeholder="Gedung / Kota" className="input"
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              value={form.status}
              onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="input"
            >
              {['draft','aktif','selesai','batal'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <textarea
              value={form.deskripsi}
              onChange={e => setForm(p => ({ ...p, deskripsi: e.target.value }))}
              rows={3} placeholder="Deskripsi singkat event..."
              className="input resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">
              Batal
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : 'Buat Event'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}