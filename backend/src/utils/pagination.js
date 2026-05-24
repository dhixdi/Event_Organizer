function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function getPaginationParams(query = {}) {
  const page = parsePositiveInteger(query.page, 1);
  const perPageRaw = parsePositiveInteger(query.per_page, 10);
  const perPage = Math.min(perPageRaw, 100);
  const offset = (page - 1) * perPage;

  return {
    page,
    perPage,
    offset,
    limit: perPage,
  };
}

function buildPaginationMeta({ page, perPage, total }) {
  const totalPages = total > 0 ? Math.ceil(total / perPage) : 0;

  return {
    page,
    per_page: perPage,
    total,
    total_pages: totalPages,
  };
}

function getSortParams(query = {}, { allowedSortBy = [], defaultSortBy = 'created_at', defaultOrder = 'DESC' } = {}) {
  const sortBy = allowedSortBy.includes(query.sort_by) ? query.sort_by : defaultSortBy;
  const order = String(query.order || defaultOrder).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  return { sortBy, order };
}

module.exports = {
  getPaginationParams,
  buildPaginationMeta,
  getSortParams,
};
