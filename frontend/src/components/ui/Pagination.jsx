export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.total_pages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-muted">
        Menampilkan {((meta.page - 1) * meta.per_page) + 1}–{Math.min(meta.page * meta.per_page, meta.total)} dari {meta.total} data
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page <= 1}
          className="px-3 py-1.5 text-sm glass rounded-lg disabled:opacity-40 hover:bg-white/10 transition-colors"
        >
          ← Prev
        </button>
        {Array.from({ length: Math.min(5, meta.total_pages) }, (_, i) => {
          const p = Math.max(1, Math.min(meta.page - 2, meta.total_pages - 4)) + i;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${p === meta.page ? 'bg-primary text-white' : 'glass hover:bg-white/10'}`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= meta.total_pages}
          className="px-3 py-1.5 text-sm glass rounded-lg disabled:opacity-40 hover:bg-white/10 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}