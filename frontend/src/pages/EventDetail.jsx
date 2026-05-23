import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import { tugasService } from '../services/tugasService';
import { rundownService } from '../services/rundownService';
import { vendorService } from '../services/vendorService';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { formatDate, formatDateTime } from '../utils/formatters';

const TABS = ['Ringkasan', 'Rundown', 'Vendor', 'Tugas', 'Laporan'];

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canManage, isAdmin, user } = useAuth();

  const [event, setEvent]   = useState(null);
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]       = useState('Ringkasan');

  const [rundowns, setRundowns]   = useState([]);
  const [vendors, setVendors]     = useState([]);
  const [tugas, setTugas]         = useState([]);
  const [laporan, setLaporan]     = useState([]);
  const [tabMeta, setTabMeta]     = useState(null);
  const [tabPage, setTabPage]     = useState(1);
  const [tabLoading, setTabLoading] = useState(false);

  // Fetch event detail
  useEffect(() => {
    eventService.getById(id).then(res => {
      setEvent(res.data.data.event);
      setStats(res.data.data.statistics);
    }).catch(() => navigate('/events')).finally(() => setLoading(false));
  }, [id]);

  // Fetch tab data
  useEffect(() => {
    if (!event) return;
    setTabLoading(true);
    const params = { page: tabPage, per_page: 10 };
    const calls = {
      Rundown: () => eventService.listRundowns(id, { ...params, sort_by: 'urutan', order: 'asc' }),
      Vendor:  () => eventService.listVendors(id, params),
      Tugas:   () => eventService.listTugas(id, params),
      Laporan: () => eventService.listLaporan(id, params),
    };
    const call = calls[tab];
    if (!call) { setTabLoading(false); return; }
    call().then(res => {
      const d = res.data.data;
      if (tab === 'Rundown') setRundowns(d.rundowns);
      if (tab === 'Vendor')  setVendors(d.vendors);
      if (tab === 'Tugas')   setTugas(d.tugas);
      if (tab === 'Laporan') setLaporan(d.laporan);
      setTabMeta(res.data.meta);
    }).catch(console.error).finally(() => setTabLoading(false));
  }, [tab, tabPage, event]);

  const handleTabChange = (t) => { setTab(t); setTabPage(1); };

  const handleUpdateTugasStatus = async (tugasId, newStatus) => {
    try {
      await tugasService.updateStatus(tugasId, newStatus);
      // Refresh tugas
      const res = await eventService.listTugas(id, { page: tabPage, per_page: 10 });
      setTugas(res.data.data.tugas);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal update status');
    }
  };

  if (loading) return <Spinner />;
  if (!event) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button onClick={() => navigate('/events')} className="text-sm text-muted hover:text-text-base mb-4 flex items-center gap-1 transition-colors">
          ← Kembali
        </button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl font-display font-bold text-text-base">{event.nama_event}</h1>
              <Badge value={event.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted flex-wrap">
              <span>📍 {event.lokasi || '-'}</span>
              <span>📅 {formatDate(event.tanggal_mulai)} — {formatDate(event.tanggal_selesai)}</span>
              <span>👤 {event.ketua?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat pills */}
      {stats && (
        <div className="flex gap-3 flex-wrap">
          {[
            { label: 'Vendor',   value: stats.vendors  },
            { label: 'Rundown',  value: stats.rundowns },
            { label: 'Tugas',    value: stats.tasks    },
          ].map(s => (
            <div key={s.label} className="glass rounded-lg px-4 py-2 flex items-center gap-2">
              <span className="text-2xl font-display font-bold text-primary">{s.value}</span>
              <span className="text-sm text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => handleTabChange(t)}
              className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                tab === t ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text-base'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-48">
        {tabLoading ? <Spinner /> : (
          <>
            {/* Ringkasan */}
            {tab === 'Ringkasan' && (
              <Card>
                <h3 className="font-display font-semibold mb-3 text-text-base">Deskripsi Event</h3>
                <p className="text-muted text-sm leading-relaxed">{event.deskripsi || 'Tidak ada deskripsi.'}</p>
              </Card>
            )}

            {/* Rundown */}
            {tab === 'Rundown' && (
              <div className="space-y-3">
                {rundowns.length === 0 ? <EmptyState icon="📋" title="Belum ada rundown" /> :
                  rundowns.map(r => (
                    <Card key={r.id}>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                          {r.urutan}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-medium text-text-base">{r.judul_sesi}</span>
                            <Badge value={r.status} />
                          </div>
                          <div className="text-xs text-muted flex gap-4 flex-wrap">
                            <span>🕐 {r.waktu_mulai} — {r.waktu_selesai || '?'}</span>
                            {r.pic && <span>👤 {r.pic.name}</span>}
                            {r.vendor && <span>🏢 {r.vendor.nama_vendor}</span>}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                <Pagination meta={tabMeta} onPageChange={setTabPage} />
              </div>
            )}

            {/* Vendor */}
            {tab === 'Vendor' && (
              <div className="space-y-3">
                {vendors.length === 0 ? <EmptyState icon="🏢" title="Belum ada vendor" /> :
                  vendors.map(v => (
                    <Card key={v.id}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-medium text-text-base">{v.nama_vendor}</span>
                            {v.kategori && <span className="text-xs text-muted bg-white/5 px-2 py-0.5 rounded">{v.kategori}</span>}
                            <Badge value={v.status} />
                          </div>
                          <div className="text-xs text-muted flex gap-4 flex-wrap">
                            {v.kontak_person && <span>👤 {v.kontak_person}</span>}
                            {v.telepon && <span>📞 {v.telepon}</span>}
                            {v.email && <span>✉️ {v.email}</span>}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                <Pagination meta={tabMeta} onPageChange={setTabPage} />
              </div>
            )}

            {/* Tugas */}
            {tab === 'Tugas' && (
              <div className="space-y-3">
                {tugas.length === 0 ? <EmptyState icon="✅" title="Belum ada tugas" /> :
                  tugas.map(t => (
                    <Card key={t.id}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-medium text-text-base">{t.judul}</span>
                            <Badge value={t.status} />
                            <Badge value={t.prioritas} />
                          </div>
                          <div className="text-xs text-muted flex gap-4 flex-wrap">
                            {t.assignee && <span>👤 {t.assignee.name}</span>}
                            {t.divisi && <span>🏷️ {t.divisi}</span>}
                            {t.deadline && <span>⏰ {formatDateTime(t.deadline)}</span>}
                          </div>
                        </div>
                        {/* Update status (owner atau admin) */}
                        {(isAdmin || user?.id === t.assignee_id) && (
                          <select
                            value={t.status}
                            onChange={e => handleUpdateTugasStatus(t.id, e.target.value)}
                            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-text-base focus:outline-none shrink-0"
                          >
                            {['belum', 'proses', 'selesai', 'terkendala'].map(s =>
                              <option key={s} value={s}>{s}</option>
                            )}
                          </select>
                        )}
                      </div>
                    </Card>
                  ))}
                <Pagination meta={tabMeta} onPageChange={setTabPage} />
              </div>
            )}

            {/* Laporan */}
            {tab === 'Laporan' && (
              <div className="space-y-3">
                {laporan.length === 0 ? <EmptyState icon="📄" title="Belum ada laporan" /> :
                  laporan.map(l => (
                    <Card key={l.id}>
                      <h3 className="font-medium text-text-base mb-1">{l.judul}</h3>
                      <p className="text-sm text-muted line-clamp-2 mb-2">{l.konten}</p>
                      <div className="text-xs text-muted flex gap-4">
                        <span>👤 {l.ketua?.name}</span>
                        <span>📅 {formatDate(l.tanggal)}</span>
                      </div>
                    </Card>
                  ))}
                <Pagination meta={tabMeta} onPageChange={setTabPage} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}