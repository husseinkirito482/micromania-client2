import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/admin-auth";
import { deleteCatalogItem, type CatalogAdminPayload, updateCatalogItem } from "@/lib/catalog-store";
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
  const payload = (await request.json()) as CatalogAdminPayload;

  try {
    await updateCatalogItem(id, payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Mise a jour impossible" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await deleteCatalogItem(id);
  return NextResponse.json({ success: true });
}