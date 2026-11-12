import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import Admin from "../../../../models/Admin";
import { connectToDatabase } from "../../../../lib/db";
import { createAdminToken, getAdminCookieOptions, COOKIE_NAME } from "../../../../lib/auth";
import { checkLoginRateLimit } from "../../../../lib/rate-limit";

function getClientKey(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request) {
  const rate = checkLoginRateLimit(getClientKey(request));
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 200) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  await connectToDatabase();
  const admin = await Admin.findOne({ email }).select("+passwordHash");
  const valid = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
  if (!valid) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, createAdminToken(admin), getAdminCookieOptions());
  return response;
}
