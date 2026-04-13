import { ADMIN_SESSION_COOKIE, createAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as { email?: string; password?: string };

  if (!email || !password || !verifyAdminCredentials(email, password)) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSession(email),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}