import Footer from "../../components/Footer";
import Header from "../../components/Header";
import PostCard from "../../components/PostCard";
import Pagination from "../../components/Pagination";
import SectionHeading from "../../components/SectionHeading";
import EmptyState from "../../components/EmptyState";
import { searchPostsPaginated } from "../../lib/posts";

export const metadata = {
  title: "Search government job updates | SarkariNaukri",
  description: "Search government jobs, results, admit cards, answer keys, and admissions."
};

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q.trim() : "";
  const page = Math.max(1, Number.parseInt(params?.page || "1", 10) || 1);
  const result = await searchPostsPaginated(query, page);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Search" title={query ? `Results for "${query}"` : "Search updates"} />
        <form action="/search" method="get" className="mb-8 flex max-w-2xl gap-2">
          <input name="q" defaultValue={query} required className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="Search by title or organization" aria-label="Search by title or organization" />
          <button className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800">Search</button>
        </form>
        {result.posts.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{result.posts.map((post) => <PostCard key={post.slug} post={post} />)}</div> : <EmptyState title={query ? "No matching posts" : "Enter a search term"} message={query ? "Try a different title or organization." : "Search the latest government updates."} />}
        <Pagination page={page} totalPages={result.totalPages} basePath="/search" query={{ q: query }} />
      </main>
      <Footer />
    </>
  );
}
