import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "nova_admin_session";

const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "dev-admin-secret-change-me";
}

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function verifyAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";
  return email === adminEmail && password === adminPassword;
}

export function createAdminSession(email: string) {
  const payload = JSON.stringify({ email, exp: Date.now() + SESSION_TTL_MS });
  const encoded = base64UrlEncode(payload);
  return `${encoded}.${sign(encoded)}`;
}

export function readAdminSession(token?: string | null) {
  if (!token) {
    return null;
  }

  const [encoded, signature] = token.split(".");

  if (!encoded || !signature) {
    return null;
  }

  const expectedSignature = sign(encoded);
  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encoded)) as { email: string; exp: number };
    if (payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}