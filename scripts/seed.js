import crypto from "node:crypto";
import { promisify } from "node:util";
import "dotenv/config";
import { connectToDatabase } from "../lib/db.js";
import Admin from "../models/Admin.js";
import Post from "../models/Post.js";

const scrypt = promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

const samplePosts = [
  {
    title: "Staff Selection Commission Combined Graduate Level 2026",
    slug: "ssc-cgl-2026",
    category: "job",
    organization: "Staff Selection Commission",
    shortInfo: "Apply online for graduate-level posts through SSC CGL 2026.",
    content: "<p>Official notification and application details will be updated here.</p>",
    importantDates: [{ label: "Application start", date: "To be announced" }],
    applicationFee: [{ category: "General", amount: "As per notification" }],
    ageLimit: "18 to 32 years",
    vacancyDetails: [{ postName: "Combined Graduate Level posts", total: 0 }],
    eligibility: "Bachelor's degree from a recognized university.",
    importantLinks: [{ label: "Official website", url: "https://ssc.gov.in" }],
    sourceUrl: "https://ssc.gov.in",
    isPublished: true,
    isFeatured: true
  },
  {
    title: "Union Public Service Commission Civil Services Result 2026",
    slug: "upsc-civil-services-result-2026",
    category: "result",
    organization: "Union Public Service Commission",
    shortInfo: "Check the latest UPSC Civil Services examination result updates.",
    content: "<p>Result links and instructions will be published after the official release.</p>",
    importantLinks: [{ label: "Official website", url: "https://upsc.gov.in" }],
    sourceUrl: "https://upsc.gov.in",
    isPublished: true
  },
  {
    title: "Railway Recruitment Board Group D Admit Card 2026",
    slug: "rrb-group-d-admit-card-2026",
    category: "admit-card",
    organization: "Railway Recruitment Board",
    shortInfo: "Find admit card and examination city information for RRB Group D.",
    content: "<p>Download instructions will be added when the official link is active.</p>",
    importantLinks: [{ label: "Official website", url: "https://www.rrbcdg.gov.in" }],
    sourceUrl: "https://www.rrbcdg.gov.in",
    isPublished: true
  }
];

async function seed() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding.");
  }

  await connectToDatabase();

  await Admin.updateOne(
    { email: ADMIN_EMAIL },
    { $set: { email: ADMIN_EMAIL, passwordHash: await hashPassword(ADMIN_PASSWORD) } },
    { upsert: true }
  );

  for (const post of samplePosts) {
    await Post.updateOne({ slug: post.slug }, { $setOnInsert: post }, { upsert: true });
  }

  console.log(`Seeded admin ${ADMIN_EMAIL} and ${samplePosts.length} sample posts.`);
}

try {
  await seed();
} catch (error) {
  console.error("Seed failed:", error);
  process.exitCode = 1;
} finally {
  await import("mongoose").then(({ default: mongoose }) => mongoose.disconnect());
}
