import { connectToDatabase } from "./db.js";
import Post from "../models/Post.js";

export const CATEGORY_LABELS = {
  job: "Jobs",
  result: "Results",
  "admit-card": "Admit Cards",
  "answer-key": "Answer Keys",
  syllabus: "Syllabus",
  admission: "Admissions",
  important: "Important"
};

export const CATEGORY_SLUGS = Object.keys(CATEGORY_LABELS);

function publishedQuery(extra = {}) {
  return { isPublished: true, ...extra };
}

function dateRangeForMonth(month) {
  if (!/^\d{4}-\d{2}$/.test(month || "")) return null;
  const [year, monthNumber] = month.split("-").map(Number);
  if (monthNumber < 1 || monthNumber > 12) return null;
  return {
    $gte: new Date(Date.UTC(year, monthNumber - 1, 1)),
    $lt: new Date(Date.UTC(year, monthNumber, 1))
  };
}

function categoryFilter(category, filters = {}) {
  const filter = publishedQuery({ category });
  if (filters.organization) filter.organization = filters.organization;
  const monthRange = dateRangeForMonth(filters.month);
  if (monthRange) filter.createdAt = monthRange;
  return filter;
}

function sortFor(sort) {
  return sort === "most-viewed" ? { views: -1, createdAt: -1 } : { createdAt: -1 };
}

export async function getLatestPosts(limit = 8, query = {}) {
  await connectToDatabase();
  return Post.find(publishedQuery(query)).sort({ createdAt: -1 }).limit(limit).lean();
}

export async function getPostsByCategory(category, page = 1, limit = 20, filters = {}) {
  await connectToDatabase();
  const filter = categoryFilter(category, filters);
  const [posts, total] = await Promise.all([
    Post.find(filter).sort(sortFor(filters.sort)).skip((page - 1) * limit).limit(limit).lean(),
    Post.countDocuments(filter)
  ]);
  return { posts, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export async function getCategoryFilterOptions(category) {
  await connectToDatabase();
  return Post.distinct("organization", publishedQuery({ category }));
}

export async function getPostBySlug(slug) {
  await connectToDatabase();
  return Post.findOne(publishedQuery({ slug })).lean();
}

export async function getRelatedPosts(category, excludeSlug, limit = 3) {
  await connectToDatabase();
  return Post.find(publishedQuery({ category, slug: { $ne: excludeSlug } }))
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function searchPosts(query, limit = 8) {
  await connectToDatabase();
  const search = query.trim();
  if (!search) return getLatestPosts(limit);
  return Post.find(publishedQuery({ $text: { $search: search } }))
    .sort({ score: { $meta: "textScore" }, createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function searchPostsPaginated(query, page = 1, limit = 20) {
  await connectToDatabase();
  const search = query.trim();
  if (!search) return { posts: [], total: 0, totalPages: 1 };
  const filter = publishedQuery({ $text: { $search: search } });
  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter)
  ]);
  return { posts, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export async function suggestPosts(query, limit = 5) {
  await connectToDatabase();
  const search = query.trim();
  if (!search) return [];
  return Post.find(publishedQuery({ $text: { $search: search } }))
    .select("title slug category organization")
    .sort({ score: { $meta: "textScore" }, createdAt: -1 })
    .limit(limit)
    .lean();
}

export function serializePost(post) {
  return {
    ...post,
    _id: post._id?.toString(),
    createdAt: post.createdAt?.toISOString?.() || post.createdAt,
    updatedAt: post.updatedAt?.toISOString?.() || post.updatedAt
  };
}
