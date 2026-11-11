import "dotenv/config";
import { connectToDatabase } from "../lib/db.js";
import Post from "../models/Post.js";
import ScrapeLog from "../models/ScrapeLog.js";
import {
  CATEGORY_CONFIG,
  DEFAULT_BASE_URL,
  DEFAULT_CONCURRENCY
} from "./config.js";
import { createHttpClient, mapWithConcurrency } from "./http.js";
import { extractListingLinks, extractPost } from "./parser.js";

function parseArgs(argv) {
  const values = {};
  for (const argument of argv) {
    const [key, value] = argument.replace(/^--/, "").split("=");
    values[key] = value || true;
  }
  return values;
}

function getCategory(category) {
  const normalized = category === "admit-card" ? "admit-cards" : category;
  const config = CATEGORY_CONFIG[normalized];
  if (!config) {
    throw new Error(`Unsupported category "${category}". Use: ${Object.keys(CATEGORY_CONFIG).join(", ")}`);
  }
  return { name: normalized, ...config };
}

async function savePost(post) {
  const existing = await Post.findOne({ sourceUrl: post.sourceUrl });
  if (!existing) {
    await Post.create(post);
    return "new";
  }
  if (existing.sourceHash === post.sourceHash) return "unchanged";

  await Post.updateOne(
    { _id: existing._id },
    { $set: { ...post, slug: existing.slug, isPublished: existing.isPublished, isFeatured: existing.isFeatured, views: existing.views } }
  );
  return "updated";
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const category = getCategory(args.category || "jobs");
  const limit = Math.max(1, Number(args.limit || 20));
  const baseUrl = process.env.SCRAPE_BASE_URL || DEFAULT_BASE_URL;
  const http = createHttpClient();
  const startedAt = new Date();
  const log = await ScrapeLog.create({ startedAt, status: "running" });
  let newCount = 0;
  let updatedCount = 0;
  const errors = [];

  try {
    await connectToDatabase();
    const listingUrl = new URL(category.path, baseUrl).toString();
    const listingHtml = await http(listingUrl);
    const links = extractListingLinks(listingHtml, listingUrl).slice(0, limit);
    const results = await mapWithConcurrency(links, DEFAULT_CONCURRENCY, async ({ url }) => {
      try {
        const html = await http(url);
        const result = await savePost(extractPost(html, url, category.postCategory));
        if (result === "new") newCount += 1;
        if (result === "updated") updatedCount += 1;
        return { url, result };
      } catch (error) {
        errors.push(`${url}: ${error.message}`);
        return { url, result: "error", error: error.message };
      }
    });

    await ScrapeLog.updateOne(
      { _id: log._id },
      { $set: { finishedAt: new Date(), status: errors.length ? "failed" : "completed", newCount, updatedCount, errors } }
    );
    console.log(JSON.stringify({ category: category.name, listingUrl, processed: results.length, newCount, updatedCount, errors, sample: results.slice(0, 3) }, null, 2));
  } catch (error) {
    await ScrapeLog.updateOne(
      { _id: log._id },
      { $set: { finishedAt: new Date(), status: "failed", newCount, updatedCount, errors: [...errors, error.message] } }
    );
    throw error;
  }
}

try {
  await run();
} catch (error) {
  console.error(`Scrape failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  const mongoose = await import("mongoose");
  await mongoose.default.disconnect();
}
