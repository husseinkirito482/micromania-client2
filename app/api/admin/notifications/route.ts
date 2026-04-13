import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/admin-auth";
import { createGlobalNotification, listGlobalNotifications } from "@/lib/catalog-store";
import { NextRequest, NextResponse } from "next/server";

function isAuthorized(request: NextRequest) {
  return Boolean(readAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value));
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = Number(request.nextUrl.searchParams.get("page") || "1");
  const notifications = await listGlobalNotifications(page);
  return NextResponse.json(notifications);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as { title?: string; message?: string };

  if (!payload.title?.trim() || !payload.message?.trim()) {
    return NextResponse.json({ error: "Titre et message requis" }, { status: 400 });
  }

  const notification = await createGlobalNotification(payload.title, payload.message);
  return NextResponse.json({ notification }, { status: 201 });
}