function formatDate(value) {
  if (!value) return "Not announced";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function LinkRow({ post }) {
  return (
    <li className="link-row flex items-center justify-between gap-3">
      <a href={`/post/${post.slug}`} className="link-row__title min-w-0 flex-1 text-sm font-medium leading-5">
        {post.title}
      </a>
      <time className="shrink-0 text-xs text-[var(--text-secondary)]" dateTime={post.createdAt || undefined}>
        {formatDate(post.createdAt)}
      </time>
    </li>
  );
}
