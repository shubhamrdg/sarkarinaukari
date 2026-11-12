export default function EmptyState({ title = "No posts found", message = "Check back soon for new updates." }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-pretty text-sm text-slate-500">{message}</p>
      <a href="/" className="mt-4 inline-block text-sm font-semibold text-blue-700">Browse latest posts</a>
    </div>
  );
}
