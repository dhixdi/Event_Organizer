import { STATUS_COLORS, ROLE_COLORS, STATUS_ICONS, ROLE_ICONS } from '../../utils/formatters';

export default function Badge({ value, type = 'status', showIcon = false }) {
  const map = type === 'role' ? ROLE_COLORS : STATUS_COLORS;
  const iconMap = type === 'role' ? ROLE_ICONS : STATUS_ICONS;
  const cls = map[value] ?? 'bg-border-light text-text-muted border border-border';
  const icon = showIcon ? iconMap[value] : null;

  return (
    <span className={`pill ${cls}`}>
      {icon && <span className="mr-0.5">{icon}</span>}
      {value}
    </span>
  );
}