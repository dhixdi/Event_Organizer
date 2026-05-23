import { STATUS_COLORS, ROLE_COLORS } from '../../utils/formatters';

export default function Badge({ value, type = 'status' }) {
  const map = type === 'role' ? ROLE_COLORS : STATUS_COLORS;
  const cls = map[value] ?? 'bg-white/10 text-white/60 border-white/10';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${cls}`}>
      {value}
    </span>
  );
}