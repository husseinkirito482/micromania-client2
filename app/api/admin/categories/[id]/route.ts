import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/admin-auth";
import { deleteShopCategory, updateShopCategory } from "@/lib/catalog-store";
import { NextRequest, NextResponse } from "next/server";

function isAuthorized(request: NextRequest) {
  return Boolean(readAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value));
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const payload = (await request.json()) as { name?: string; image?: string };

  if (!payload.name?.trim()) {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  }

  try {
    const category = await updateShopCategory(id, { name: payload.name, image: payload.image });
    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Mise a jour impossible" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    await deleteShopCategory(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Suppression impossible" }, { status: 400 });
  }
}