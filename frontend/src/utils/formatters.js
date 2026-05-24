export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) : '-';

export const formatDateTime = (d) =>
  d ? new Date(d).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }) : '-';

export const formatDateShort = (d) =>
  d ? new Date(d).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short'
  }) : '-';

export const formatRelative = (d) => {
  if (!d) return '-';
  const date = new Date(d);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  return formatDate(d);
};

/* ─── Status Color Map ─────────────────── */
export const STATUS_COLORS = {
  // Event status
  aktif:      'bg-success/10 text-success border border-success/20',
  draft:      'bg-text-light/10 text-text-muted border border-border',
  selesai:    'bg-accent-bg text-accent border border-accent/20',
  batal:      'bg-danger-bg text-danger border border-danger/20',

  // Task status
  belum:      'bg-border-light text-text-muted border border-border',
  proses:     'bg-secondary-bg text-secondary-dark border border-secondary/30',
  terkendala: 'bg-danger-bg text-danger border border-danger/20',

  // Rundown status
  berjalan:   'bg-primary-bg text-primary border border-primary/20',
  ditunda:    'bg-warning-bg text-warning border border-warning/20',

  // Vendor status
  // aktif → same as event

  // Priority
  rendah:     'bg-border-light text-text-muted border border-border',
  sedang:     'bg-accent-bg text-accent border border-accent/20',
  tinggi:     'bg-secondary-bg text-secondary-dark border border-secondary/30',
  kritis:     'bg-danger-bg text-danger border border-danger/20',
};

export const ROLE_COLORS = {
  admin:  'bg-primary-bg text-primary border border-primary/20',
  ketua:  'bg-accent-bg text-accent border border-accent/20',
  staf:   'bg-secondary-bg text-secondary-dark border border-secondary/30',
};

export const ROLE_ICONS = {
  admin: '👑',
  ketua: '🎯',
  staf:  '⚡',
};

export const STATUS_ICONS = {
  aktif:      '🟢',
  draft:      '📝',
  selesai:    '✅',
  batal:      '❌',
  belum:      '⏳',
  proses:     '🔄',
  terkendala: '⚠️',
  berjalan:   '▶️',
  ditunda:    '⏸️',
  rendah:     '↓',
  sedang:     '→',
  tinggi:     '↑',
  kritis:     '🔴',
};