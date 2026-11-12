import { connectToDatabase } from "./db.js";
import Post from "../models/Post.js";
import ScrapeLog from "../models/ScrapeLog.js";

export const POST_CATEGORIES = ["job", "result", "admit-card", "answer-key", "syllabus", "admission", "important"];

export function serialize(value) {
  if (!value) return value;
  return { ...value, _id: value._id?.toString(), createdAt: value.createdAt?.toISOString?.(), updatedAt: value.updatedAt?.toISOString?.() };
}

export function validatePost(input) {
  const post = {
    title: String(input?.title || "").trim(),
    slug: String(input?.slug || "").trim().toLowerCase(),
    category: String(input?.category || ""),
    organization: String(input?.organization || "").trim(),
    shortInfo: String(input?.shortInfo || "").trim(),
    content: String(input?.content || ""),
    ageLimit: String(input?.ageLimit || "").trim(),
    eligibility: String(input?.eligibility || "").trim(),
    sourceUrl: String(input?.sourceUrl || "").trim(),
    isPublished: Boolean(input?.isPublished),
    isFeatured: Boolean(input?.isFeatured),
    importantDates: Array.isArray(input?.importantDates) ? input.importantDates : [],
    applicationFee: Array.isArray(input?.applicationFee) ? input.applicationFee : [],
    vacancyDetails: Array.isArray(input?.vacancyDetails) ? input.vacancyDetails : [],
    importantLinks: Array.isArray(input?.importantLinks) ? input.importantLinks : []
  };
  if (!post.title || !post.slug || !post.organization || !post.shortInfo || !post.content) throw new Error("Title, slug, organization, summary, and content are required.");
  if (!POST_CATEGORIES.includes(post.category)) throw new Error("Choose a valid category.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) throw new Error("Slug may contain lowercase letters, numbers, and hyphens.");
  return post;
}

export async function getDashboardData() {
  await connectToDatabase();
  const [categories, views, lastScrape, recentPosts, drafts] = await Promise.all([
    Post.aggregate([{ $match: { isPublished: true } }, { $group: { _id: "$category", count: { $sum: 1 } } }]),
    Post.aggregate([{ $group: { _id: null, views: { $sum: "$views" } } }]),
    ScrapeLog.findOne().sort({ startedAt: -1 }).lean(),
    Post.find().sort({ createdAt: -1 }).limit(8).lean(),
    Post.countDocuments({ isPublished: false })
  ]);
  return { categories, views: views[0]?.views || 0, lastScrape: serialize(lastScrape), recentPosts: recentPosts.map(serialize), drafts };
}
