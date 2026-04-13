import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/admin-auth";
import { createCatalogItem, type CatalogAdminPayload } from "@/lib/catalog-store";
import { NextRequest, NextResponse } from "next/server";

function isAuthorized(request: NextRequest) {
  return Boolean(readAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value));
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as CatalogAdminPayload;

  if (!payload.type || !payload.title || !payload.description) {
    return NextResponse.json({ error: "Payload incomplet" }, { status: 400 });
  }

  try {
    const item = await createCatalogItem(payload);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Creation impossible" }, { status: 400 });
  }
}