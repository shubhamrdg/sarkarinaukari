import { NextResponse } from "next/server";
import Post from "../../../../../../models/Post";
import { connectToDatabase } from "../../../../../../lib/db";

export async function PATCH(request, { params }) {
  const body = await request.json();
  if (!["isPublished", "isFeatured"].includes(body?.field) || typeof body.value !== "boolean") return NextResponse.json({ error: "Invalid toggle." }, { status: 400 });
  await connectToDatabase();
  const post = await Post.findByIdAndUpdate((await params).id, { $set: { [body.field]: body.value } }, { new: true }).lean();
  return post ? NextResponse.json({ ok: true, value: post[body.field] }) : NextResponse.json({ error: "Post not found." }, { status: 404 });
}
