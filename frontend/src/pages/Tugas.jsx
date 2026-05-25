import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tugasService } from '../services/tugasService';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { useToast } from '../components/ui/Toast';
import { formatDateTime, formatDate } from '../utils/formatters';

const STATUSES   = ['', 'belum', 'proses', 'selesai', 'terkendala'];
const PRIORITAS  = ['', 'rendah', 'sedang', 'tinggi', 'kritis'];

export default function Tugas() {
  const { user } = useAuth();
  const toast = useToast();

  const [tugas,   setTugas]   = useState([]);
  const [meta,    setMeta]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [status,  setStatus]  = useState('');
  const [prioritas, setPrioritas] = useState('');
  const [search,  setSearch]  = useState('');

  const fetchTugas = useCallback(() => {
    if (!user?.id) return;
    setLoading(true);
    tugasService.list({
      page,
      per_page: 10,
      assignee_id: user.id,
      status:   status   || undefined,
      prioritas: prioritas || undefined,
      q: search || undefined,
    }).then(res => {
      setTugas(res.data.data.tugas || []);
      setMeta(res.data.meta);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [page, status, prioritas, search, user?.id]);

  useEffect(() => { fetchTugas(); }, [fetchTugas]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await tugasService.updateStatus(id, newStatus);
      toast('Status berhasil diupdate!', 'success');
      fetchTugas();
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal update status', 'error');
    }
  };

  const urgentCount = tugas.filter(t =>
    (t.prioritas === 'kritis' || t.prioritas === 'tinggi') && t.status !== 'selesai'
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-base">Tugas Saya</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Daftar tugas yang ditugaskan kepada Anda
            {urgentCount > 0 && (
              <span className="ml-2 pill bg-danger-bg text-danger border border-danger/20">
                {urgentCount} mendesak
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light text-sm">🔍</span>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari tugas..."
            className="input pl-9"
          />
        </div>
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="input w-auto"
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Semua Status'}
            </option>
          ))}
        </select>
        <select
          value={prioritas}
          onChange={e => { setPrioritas(e.target.value); setPage(1); }}
          className="input w-auto"
        >
          {PRIORITAS.map(p => (
            <option key={p} value={p}>
              {p ? p.charAt(0).toUpperCase() + p.slice(1) : 'Semua Prioritas'}
            </option>
          ))}
        </select>
      </div>

      {/* Count */}
      {meta && !loading && (
        <p className="text-sm text-text-muted">
          Menampilkan <span className="font-medium text-text-base">{tugas.length}</span> dari{' '}
          <span className="font-medium text-text-base">{meta.total}</span> tugas
        </p>
      )}

      {/* List */}
      {loading ? (
        <Spinner label="Memuat tugas..." />
      ) : tugas.length === 0 ? (
        <EmptyState
          icon="✅"
          title="Belum ada tugas"
          desc="Tidak ada tugas yang ditugaskan kepada Anda saat ini."
        />
      ) : (
        <div className="space-y-3">
          {tugas.map(t => {
            const isOverdue = t.deadline && new Date(t.deadline) < new Date() && t.status !== 'selesai';
            return (
              <div
                key={t.id}
                className={`bg-surface rounded-2xl border shadow-card p-5 transition-all ${
                  isOverdue ? 'border-danger/30' : 'border-border-light'
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-semibold text-text-base">{t.judul}</h3>
                      <Badge value={t.status} />
                      <Badge value={t.prioritas} />
                    </div>
                    {t.deskripsi && (
                      <p className="text-sm text-text-muted line-clamp-2 mb-2">{t.deskripsi}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap">
                      {t.divisi && <span>🏷️ {t.divisi}</span>}
                      {t.deadline && (
                        <span className={isOverdue ? 'text-danger font-medium' : ''}>
                          ⏰ {formatDateTime(t.deadline)}
                          {isOverdue && ' (Terlambat!)'}
                        </span>
                      )}
                      {t.catatan && <span>📝 {t.catatan}</span>}
                    </div>
                  </div>

                  {/* Quick status update */}
                  <div className="shrink-0">
                    <label className="label text-xs mb-1">Update Status</label>
                    <select
                      value={t.status}
                      onChange={e => handleStatusUpdate(t.id, e.target.value)}
                      className="px-2 py-1.5 bg-surface-2 border border-border rounded-lg text-xs text-text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    >
                      {['belum', 'proses', 'selesai', 'terkendala'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Lampiran */}
                {t.lampiran_url && (
                  <div className="mt-3 pt-3 border-t border-border-light">
                    <a
                      href={t.lampiran_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
                    >
                      📎 Lihat Lampiran
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
}