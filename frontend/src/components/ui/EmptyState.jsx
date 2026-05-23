export default function EmptyState({ icon = '📭', title = 'Tidak ada data', desc = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-display font-semibold text-text-base mb-1">{title}</h3>
      {desc && <p className="text-sm text-muted max-w-xs">{desc}</p>}
    </div>
  );
}