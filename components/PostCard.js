import CategoryBadge from "./CategoryBadge";
import { ArrowIcon } from "./Icon";

export default function PostCard({ post }) {
  const date = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : post.date;
  return (
    <article className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/20 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <CategoryBadge category={post.category} />
        <span className="text-xs text-slate-400">{date}</span>
      </div>
      <h3 className="mt-4 text-base font-semibold leading-6 text-slate-950 group-hover:text-blue-700">
        <a href={`/post/${post.slug}`} className="outline-none">{post.title}</a>
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{post.shortInfo}</p>
      <a href={`/post/${post.slug}`} className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-blue-700">
        View details <ArrowIcon className="size-4 transition group-hover:translate-x-0.5" />
      </a>
    </article>
  );
}
