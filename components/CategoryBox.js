import LinkRow from "./LinkRow";

export default function CategoryBox({ category, title, posts = [], loading = false, error = false }) {
  return (
    <section className="category-box" data-category={category} aria-labelledby={`${category}-heading`}>
      <div className="category-box__header flex items-center justify-between gap-3">
        <h2 id={`${category}-heading`} className="text-lg font-bold leading-tight">{title}</h2>
        <span className="text-xs font-medium opacity-90">{posts.length || 0} updates</span>
      </div>
      {loading ? (
        <div className="space-y-2 p-3" aria-label="Loading updates">
          {[1, 2, 3].map((item) => <div key={item} className="h-8 animate-pulse bg-[var(--surface-muted)]" />)}
        </div>
      ) : error ? (
        <p className="p-3 text-sm text-[var(--status-error)]" role="alert">Updates could not be loaded.</p>
      ) : posts.length ? (
        <ul>{posts.map((post) => <LinkRow key={post.slug} post={post} />)}</ul>
      ) : (
        <p className="p-3 text-sm text-[var(--text-secondary)]">No updates yet.</p>
      )}
      <a href={`/category/${category}`} className="block border-t border-[var(--border-default)] px-3 py-3 text-sm font-bold hover:text-[var(--link-hover)] hover:underline">
        View all {title}
      </a>
    </section>
  );
}
