export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.total_pages <= 1) return null;

  const { page, per_page, total, total_pages } = meta;
  const start = (page - 1) * per_page + 1;
  const end   = Math.min(page * per_page, total);

  // Build page numbers: show at most 5 pages centred on current
  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const delta = 2;
  const left  = Math.max(2, page - delta);
  const right = Math.min(total_pages - 1, page + delta);
  const pages = [1, ...range(left, right), total_pages].filter((v, i, a) => a.indexOf(v) === i).sort((a,b)=>a-b);

  return (
    <div className="flex items-center justify-between mt-6 px-1">
      <p className="text-sm text-text-muted">
        Menampilkan <span className="font-medium text-text-base">{start}–{end}</span> dari{' '}
        <span className="font-medium text-text-base">{total}</span> data
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn btn-ghost btn-sm disabled:opacity-30"
        >
          ← Prev
        </button>

        {pages.map((p, idx) => {
          const prev = pages[idx - 1];
          return (
            <>
              {prev && p - prev > 1 && (
                <span key={`ellipsis-${p}`} className="px-2 text-text-light text-sm">…</span>
              )}
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                  p === page
                    ? 'bg-primary text-white shadow-primary'
                    : 'hover:bg-surface-2 text-text-muted hover:text-text-base'
                }`}
              >
                {p}
              </button>
            </>
          );
        })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= total_pages}
          className="btn btn-ghost btn-sm disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  );
}