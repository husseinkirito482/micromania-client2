import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/admin-auth";
import { createShopCategory, listShopCategoriesWithCounts } from "@/lib/catalog-store";
import { NextRequest, NextResponse } from "next/server";

function isAuthorized(request: NextRequest) {
  return Boolean(readAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value));
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await listShopCategoriesWithCounts();
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as { name?: string; image?: string };

  if (!payload.name?.trim()) {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  }

  try {
    const category = await createShopCategory({ name: payload.name, image: payload.image });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Creation impossible" }, { status: 400 });
  }
}