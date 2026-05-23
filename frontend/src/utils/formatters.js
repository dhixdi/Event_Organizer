export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' }) : '-';

export const formatDateTime = (d) =>
  d ? new Date(d).toLocaleString('id-ID', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '-';

export const STATUS_COLORS = {
  aktif:       'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  draft:       'bg-slate-500/20 text-slate-400 border-slate-500/30',
  selesai:     'bg-blue-500/20 text-blue-400 border-blue-500/30',
  batal:       'bg-red-500/20 text-red-400 border-red-500/30',
  belum:       'bg-slate-500/20 text-slate-400 border-slate-500/30',
  proses:      'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  terkendala:  'bg-red-500/20 text-red-400 border-red-500/30',
  berjalan:    'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  ditunda:     'bg-orange-500/20 text-orange-400 border-orange-500/30',
  rendah:      'bg-slate-500/20 text-slate-400 border-slate-500/30',
  sedang:      'bg-blue-500/20 text-blue-400 border-blue-500/30',
  tinggi:      'bg-orange-500/20 text-orange-400 border-orange-500/30',
  kritis:      'bg-red-500/20 text-red-400 border-red-500/30',
};

export const ROLE_COLORS = {
  admin: 'bg-primary/20 text-primary border-primary/30',
  ketua: 'bg-secondary/20 text-secondary border-secondary/30',
  staf:  'bg-accent/20 text-accent border-accent/30',
};