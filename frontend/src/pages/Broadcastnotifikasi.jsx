import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { realtimeService } from '../services/realtimeService';
import { eventService } from '../services/eventService';
import { userService } from '../services/userService';
import { useToast } from '../components/ui/Toast';
import Spinner from '../components/ui/Spinner';
import { formatRelative } from '../utils/formatters';

const TIPE_OPTIONS = ['tugas', 'rundown', 'vendor', 'sistem'];
const TIPE_ICONS   = { tugas: '✅', rundown: '📋', vendor: '🏢', sistem: '⚙️' };

const INIT_FORM = { user_id: '', event_id: '', judul: '', pesan: '', tipe: 'sistem' };

export default function BroadcastNotifikasi() {
  const { user, canManage } = useAuth();
  const toast = useToast();

  const [users,   setUsers]   = useState([]);
  const [events,  setEvents]  = useState([]);
  const [myNotifs, setMyNotifs] = useState([]);
  const [form,    setForm]    = useState(INIT_FORM);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userService.list({ per_page: 100 }),
      eventService.list({ per_page: 50 }),
      realtimeService.getMyNotifications(),
    ]).then(([uRes, eRes, nRes]) => {
      setUsers(uRes.data.data.users || []);
      setEvents(eRes.data.data.events || []);
      setMyNotifs((nRes.data.data.notifications || []).slice(0, 10));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.user_id || !form.event_id || !form.judul || !form.pesan) {
      toast('Semua field wajib diisi', 'error');
      return;
    }
    setSending(true);
    try {
      await realtimeService.createNotification({
        user_id:  parseInt(form.user_id),
        event_id: parseInt(form.event_id),
        judul:    form.judul,
        pesan:    form.pesan,
        tipe:     form.tipe,
      });
      toast('Notifikasi berhasil dikirim!', 'success');
      setForm(INIT_FORM);
      // Refresh my notifs
      const nRes = await realtimeService.getMyNotifications();
      setMyNotifs((nRes.data.data.notifications || []).slice(0, 10));
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal mengirim notifikasi', 'error');
    } finally { setSending(false); }
  };

  if (!canManage) return (
    <div className="text-center py-16 text-text-muted">
      <p className="text-4xl mb-3">🔒</p>
      <p>Hanya admin dan ketua yang dapat mengakses halaman ini.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-text-base">Broadcast Notifikasi</h1>
        <p className="text-text-muted text-sm mt-0.5">Kirim notifikasi ke anggota tim</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-surface rounded-2xl border border-border-light shadow-card p-6">
          <h2 className="font-display font-semibold text-text-base mb-5">Kirim Notifikasi</h2>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="label">Penerima *</label>
              <select
                value={form.user_id} required className="input"
                onChange={e => setForm(p => ({ ...p, user_id: e.target.value }))}
              >
                <option value="">— Pilih User —</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role}{u.divisi ? ` • ${u.divisi}` : ''})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Event Terkait *</label>
              <select
                value={form.event_id} required className="input"
                onChange={e => setForm(p => ({ ...p, event_id: e.target.value }))}
              >
                <option value="">— Pilih Event —</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.nama_event}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Tipe Notifikasi</label>
              <div className="flex gap-2 flex-wrap">
                {TIPE_OPTIONS.map(t => (
                  <button
                    key={t} type="button"
                    onClick={() => setForm(p => ({ ...p, tipe: t }))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      form.tipe === t
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface-2 text-text-muted border-border hover:border-primary/30'
                    }`}
                  >
                    {TIPE_ICONS[t]} {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Judul Notifikasi *</label>
              <input
                value={form.judul} required className="input"
                onChange={e => setForm(p => ({ ...p, judul: e.target.value }))}
                placeholder="Judul singkat notifikasi"
              />
            </div>

            <div>
              <label className="label">Isi Pesan *</label>
              <textarea
                value={form.pesan} required rows={3} className="input resize-none"
                onChange={e => setForm(p => ({ ...p, pesan: e.target.value }))}
                placeholder="Detail pesan notifikasi..."
              />
            </div>

            <button type="submit" disabled={sending} className="btn-primary w-full">
              {sending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mengirim...
                </span>
              ) : '🔔 Kirim Notifikasi'}
            </button>
          </form>
        </div>

        {/* Recent notifications (my own) */}
        <div className="bg-surface rounded-2xl border border-border-light shadow-card p-6">
          <h2 className="font-display font-semibold text-text-base mb-5">Notifikasi Saya Terbaru</h2>
          {loading ? <Spinner size="sm" /> : myNotifs.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-6">Belum ada notifikasi</p>
          ) : (
            <div className="space-y-3">
              {myNotifs.map((n, i) => (
                <div key={n.id || i} className={`p-3 rounded-xl border text-sm ${
                  n.is_read ? 'bg-surface-2 border-border-light' : 'bg-primary-bg border-primary/20'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{TIPE_ICONS[n.tipe] || '🔔'}</span>
                    <span className="font-medium text-text-base">{n.judul}</span>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 ml-auto" />
                    )}
                  </div>
                  <p className="text-text-muted text-xs line-clamp-2">{n.pesan}</p>
                  <p className="text-text-light text-[10px] mt-1">{formatRelative(n.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}