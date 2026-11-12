export default function Pagination({ page = 1, totalPages = 1, basePath = "", query = {} }) {
  if (totalPages <= 1) return null;
  const makeHref = (nextPage) => {
    const params = new URLSearchParams({ ...query, page: String(nextPage) });
    return `${basePath}?${params.toString()}`;
  };
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 pt-2">
      {page > 1 ? <a href={makeHref(page - 1)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-200 hover:text-blue-700">Previous</a> : <span className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-400">Previous</span>}
      <span className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white">{page}</span>
      {page < totalPages ? <a href={makeHref(page + 1)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-200 hover:text-blue-700">Next</a> : <span className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-400">Next</span>}
    </nav>
  );
}
