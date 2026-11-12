import { spawn } from "node:child_process";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import ScrapeLog from "../../../../models/ScrapeLog";

export async function GET() {
  await connectToDatabase();
  const logs = await ScrapeLog.find().sort({ startedAt: -1 }).limit(20).lean();
  return NextResponse.json(logs.map((log) => ({ ...log, _id: log._id.toString() })));
}

export async function POST(request) {
  const body = await request.json();
  const category = String(body?.category || "jobs");
  const limit = Math.min(100, Math.max(1, Number(body?.limit || 20)));
  const allowed = ["jobs", "results", "admit-cards", "answer-keys", "syllabus", "admission", "important"];
  if (!allowed.includes(category)) return NextResponse.json({ error: "Invalid scrape category." }, { status: 400 });
  const child = spawn(process.execPath, ["scraper/run.js", `--category=${category}`, `--limit=${limit}`], { cwd: process.cwd(), detached: true, stdio: "ignore" });
  child.unref();
  return NextResponse.json({ ok: true, message: `Started ${category} scrape.` }, { status: 202 });
}
