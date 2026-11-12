import { NextResponse } from "next/server";
import Post from "../../../../models/Post";
import { connectToDatabase } from "../../../../lib/db";
import { serialize, validatePost } from "../../../../lib/admin";

export async function GET(request) {
  await connectToDatabase();
  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page") || 1));
  const limit = 20;
  const filter = {};
  const query = params.get("q")?.trim();
  if (query) filter.$or = [{ title: new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") }, { organization: new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") }];
  if (params.get("category")) filter.category = params.get("category");
  if (params.get("drafts") === "true") filter.isPublished = false;
  const [posts, total] = await Promise.all([
    Post.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Post.countDocuments(filter)
  ]);
  return NextResponse.json({ posts: posts.map(serialize), total, totalPages: Math.max(1, Math.ceil(total / limit)) });
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const post = await Post.create(validatePost(await request.json()));
    return NextResponse.json(serialize(post.toObject()), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.code === 11000 ? "Slug already exists." : error.message }, { status: 400 });
  }
}
