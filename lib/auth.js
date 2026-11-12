import jwt from "jsonwebtoken";

const COOKIE_NAME = "admin_token";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set to at least 32 characters.");
  }
  return secret;
}

export function createAdminToken(admin) {
  return jwt.sign(
    { sub: admin._id.toString(), email: admin.email, role: "admin" },
    getJwtSecret(),
    { expiresIn: "8h", issuer: "sarkarinaukari" }
  );
}

export function verifyAdminToken(token) {
  return jwt.verify(token, getJwtSecret(), { issuer: "sarkarinaukari" });
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8
  };
}

export { COOKIE_NAME };
