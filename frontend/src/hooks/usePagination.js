import { useState } from 'react';

export function usePagination(initialPage = 1, initialPerPage = 10) {
  const [page, setPage]         = useState(initialPage);
  const [perPage, setPerPage]   = useState(initialPerPage);

  const goToPage   = (p) => setPage(p);
  const nextPage   = ()  => setPage(p => p + 1);
  const prevPage   = ()  => setPage(p => Math.max(1, p - 1));
  const resetPage  = ()  => setPage(1);

  return { page, perPage, goToPage, nextPage, prevPage, resetPage, setPerPage };
}