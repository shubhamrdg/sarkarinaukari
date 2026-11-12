import { NextResponse } from "next/server";
import Post from "../../../../../models/Post";
import { connectToDatabase } from "../../../../../lib/db";
import { serialize, validatePost } from "../../../../../lib/admin";

export async function GET(request, { params }) {
  await connectToDatabase();
  const post = await Post.findById((await params).id).lean();
  return post ? NextResponse.json(serialize(post)) : NextResponse.json({ error: "Post not found." }, { status: 404 });
}

export async function PATCH(request, { params }) {
  try {
    await connectToDatabase();
    const post = await Post.findByIdAndUpdate((await params).id, { $set: validatePost(await request.json()) }, { new: true, runValidators: true }).lean();
    return post ? NextResponse.json(serialize(post)) : NextResponse.json({ error: "Post not found." }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.code === 11000 ? "Slug already exists." : error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();
  const result = await Post.findByIdAndDelete((await params).id);
  return result ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Post not found." }, { status: 404 });
}
