import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/admin-auth";
import { deleteGlobalNotification } from "@/lib/catalog-store";
import { NextRequest, NextResponse } from "next/server";

function isAuthorized(request: NextRequest) {
  return Boolean(readAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value));
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await deleteGlobalNotification(id);
  return NextResponse.json({ success: true });
}