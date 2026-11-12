import { notFound } from "next/navigation";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import PostCard from "../../../components/PostCard";
import Pagination from "../../../components/Pagination";
import SectionHeading from "../../../components/SectionHeading";
import EmptyState from "../../../components/EmptyState";
import { CATEGORY_LABELS, CATEGORY_SLUGS, getCategoryFilterOptions, getPostsByCategory } from "../../../lib/posts";

export const revalidate = 60;

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  if (!CATEGORY_LABELS[slug]) notFound();
  const query = await searchParams;
  const page = Math.max(1, Number.parseInt(query?.page || "1", 10) || 1);
  const filters = {
    organization: typeof query?.organization === "string" ? query.organization : "",
    month: typeof query?.month === "string" ? query.month : "",
    sort: query?.sort === "most-viewed" ? "most-viewed" : "latest"
  };
  const [result, organizations] = await Promise.all([
    getPostsByCategory(slug, page, 20, filters),
    getCategoryFilterOptions(slug)
  ]);
  const { posts, totalPages } = result;
  if (page > totalPages && totalPages > 1) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Category" title={CATEGORY_LABELS[slug]} />
        <p className="mb-8 max-w-2xl text-pretty text-sm leading-6 text-slate-500">The latest {CATEGORY_LABELS[slug].toLowerCase()} updates, official notices, and useful links.</p>
        <form action={`/category/${slug}`} method="get" className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
          <label className="text-sm font-medium text-slate-700">Organization
            <select name="organization" defaultValue={filters.organization} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="">All organizations</option>
              {organizations.sort().map((organization) => <option key={organization} value={organization}>{organization}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">Month
            <input type="month" name="month" defaultValue={filters.month} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
          </label>
          <label className="text-sm font-medium text-slate-700">Sort by
            <select name="sort" defaultValue={filters.sort} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="latest">Latest</option>
              <option value="most-viewed">Most viewed</option>
            </select>
          </label>
          <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 sm:col-span-3 sm:justify-self-start">Apply filters</button>
        </form>
        {posts.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</div> : <EmptyState />}
        <Pagination page={page} totalPages={totalPages} basePath={`/category/${slug}`} query={filters} />
      </main>
      <Footer />
    </>
  );
}

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const label = CATEGORY_LABELS[slug] || "Government updates";
  return {
    title: `${label} | SarkariNaukri`,
    description: `Latest ${label.toLowerCase()}, official notices, and government updates.`
  };
}
