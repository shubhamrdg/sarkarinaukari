import { NextResponse } from "next/server";
import { serializePost, suggestPosts } from "../../../../lib/posts";

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("q") || "";
  const posts = await suggestPosts(query);
  return NextResponse.json(posts.map(serializePost), {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" }
  });
}
