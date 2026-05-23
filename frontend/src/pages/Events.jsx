import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { formatDate } from '../utils/formatters';

const STATUSES = ['', 'draft', 'aktif', 'selesai', 'batal'];

export default function Events() {
  const { canManage } = useAuth();
  const [events, setEvents]     = useState([]);
  const [meta, setMeta]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({
    nama_event: '', deskripsi: '', lokasi: '',
    tanggal_mulai: '', tanggal_selesai: '', status: 'draft',
  });

  const fetchEvents = () => {
    setLoading(true);
    eventService.list({ page, per_page: 10, q: search || undefined, status: status || undefined })
      .then(res => {
        setEvents(res.data.data.events);
        setMeta(res.data.meta);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, [page, status]);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchEvents(); }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await eventService.create(form);
      setShowForm(false);
      setForm({ nama_event: '', deskripsi: '', lokasi: '', tanggal_mulai: '', tanggal_selesai: '', status: 'draft' });
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal membuat event');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-base">Events</h1>
          <p className="text-muted mt-1">Kelola semua event koordinasi</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg text-sm font-medium text-white transition-all glow"
          >
            + Buat Event
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari event..."
          className="flex-1 min-w-48 px-4 py-2 bg-surface border border-white/10 rounded-lg text-sm text-text-base placeholder:text-muted/50 focus:outline-none focus:border-primary/60 transition-all"
        />
        <select
          value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-surface border border-white/10 rounded-lg text-sm text-text-base focus:outline-none focus:border-primary/60 transition-all"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s || 'Semua Status'}</option>)}
        </select>
      </div>

      {/* List */}
      {loading ? <Spinner /> : events.length === 0 ? (
        <EmptyState icon="📅" title="Belum ada event" desc="Buat event pertama untuk mulai koordinasi" />
      ) : (
        <div className="grid gap-4">
          {events.map(event => (
            <Link key={event.id} to={`/events/${event.id}`}>
              <Card hover>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-display font-semibold text-text-base">{event.nama_event}</h3>
                      <Badge value={event.status} />
                    </div>
                    {event.deskripsi && (
                      <p className="text-sm text-muted mb-3 line-clamp-1">{event.deskripsi}</p>
                    )}
                    <div className="flex items-center gap-6 text-xs text-muted flex-wrap">
                      <span>📍 {event.lokasi || '-'}</span>
                      <span>📅 {formatDate(event.tanggal_mulai)} — {formatDate(event.tanggal_selesai)}</span>
                      <span>👤 {event.ketua?.name || '-'}</span>
                    </div>
                  </div>
                  <span className="text-muted">→</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />

      {/* Modal Create Event */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-lg text-text-base">Buat Event Baru</h3>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-text-base text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              {[
                { name: 'nama_event',     label: 'Nama Event',     type: 'text',  required: true },
                { name: 'lokasi',         label: 'Lokasi',         type: 'text',  required: false },
                { name: 'tanggal_mulai',  label: 'Tanggal Mulai',  type: 'date',  required: true },
                { name: 'tanggal_selesai',label: 'Tanggal Selesai',type: 'date',  required: true },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-sm text-muted mb-1">{f.label}</label>
                  <input
                    type={f.type} name={f.name} value={form[f.name]} required={f.required}
                    onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-text-base focus:outline-none focus:border-primary/60 transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm text-muted mb-1">Deskripsi</label>
                <textarea
                  value={form.deskripsi} rows={3}
                  onChange={e => setForm(p => ({ ...p, deskripsi: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-text-base focus:outline-none focus:border-primary/60 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2 glass rounded-lg text-sm hover:bg-white/10 transition-colors">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 py-2 bg-primary hover:bg-primary/80 rounded-lg text-sm font-medium text-white transition-all">
                  Buat Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}