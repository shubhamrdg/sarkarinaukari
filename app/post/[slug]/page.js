import { notFound } from "next/navigation";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import PostCard from "../../../components/PostCard";
import DataTable from "../../../components/DataTable";
import ShareButton from "../../../components/ShareButton";
import CategoryBadge from "../../../components/CategoryBadge";
import SectionHeading from "../../../components/SectionHeading";
import { getPostBySlug, getRelatedPosts } from "../../../lib/posts";
import { connectToDatabase } from "../../../lib/db";
import Post from "../../../models/Post";

export const revalidate = 60;

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  await connectToDatabase();
  await Post.updateOne({ _id: post._id }, { $inc: { views: 1 } });
  const related = await getRelatedPosts(post.category, post.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jobSchema = post.category === "job" ? {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: post.title,
    description: post.shortInfo,
    datePosted: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
    hiringOrganization: { "@type": "Organization", name: post.organization },
    url: `${siteUrl}/post/${post.slug}`,
    employmentType: "FULL_TIME"
  } : null;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {jobSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }} />}
        <div className="flex items-center justify-between gap-4">
          <CategoryBadge category={post.category} />
          <ShareButton />
        </div>
        <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-slate-500">{post.organization}{post.createdAt ? ` · ${new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : ""}</p>
        <article className="mt-8 space-y-8">
          <div className="prose prose-slate max-w-none text-pretty text-sm leading-7" dangerouslySetInnerHTML={{ __html: typeof post.content === "string" ? post.content : "" }} />
          <DataTable caption="Important dates" headers={["Date", "Details"]} rows={post.importantDates?.map((item) => [item.label, item.date])} />
          <DataTable caption="Application fee" headers={["Category", "Fee"]} rows={post.applicationFee?.map((item) => [item.category, item.amount])} />
          <DataTable caption="Vacancies" headers={["Post", "Total vacancies"]} rows={post.vacancyDetails?.map((item) => [item.postName, item.total.toLocaleString("en-IN")])} />
          {post.ageLimit && <section><h2 className="text-xl font-bold text-slate-950">Age limit</h2><p className="mt-2 text-pretty text-sm leading-7 text-slate-600">{post.ageLimit}</p></section>}
          {post.eligibility && <section><h2 className="text-xl font-bold text-slate-950">Eligibility</h2><p className="mt-2 whitespace-pre-line text-pretty text-sm leading-7 text-slate-600">{post.eligibility}</p></section>}
          {!!post.importantLinks?.length && <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><h2 className="text-xl font-bold text-blue-950">Important Links</h2><div className="mt-4 flex flex-wrap gap-3">{post.importantLinks.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">{link.label}</a>)}</div></section>}
        </article>
        {related.length > 0 && <section className="mt-14"><SectionHeading eyebrow="Keep reading" title="Related posts" /><div className="grid gap-4 sm:grid-cols-3">{related.map((item) => <PostCard key={item.slug} post={item} />)}</div></section>}
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: `${post.title} | SarkariNaukri`,
    description: post.shortInfo,
    alternates: { canonical: `${siteUrl}/post/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.shortInfo,
      type: "article",
      url: `${siteUrl}/post/${post.slug}`
    }
  };
}
