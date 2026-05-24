export default function EmptyState({ icon = '📭', title = 'Tidak ada data', desc = '', action = null }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center text-3xl mb-4 shadow-card">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-text-base mb-1">{title}</h3>
      {desc && <p className="text-sm text-text-muted max-w-xs leading-relaxed">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}