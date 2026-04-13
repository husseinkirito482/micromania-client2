import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/admin-auth";
import { getCatalogStats, listGlobalNotifications, listShopCategoriesWithCounts, readCatalogData } from "@/lib/catalog-store";
import { NextRequest, NextResponse } from "next/server";

function isAuthorized(request: NextRequest) {
  return Boolean(readAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value));
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [catalog, stats, categories, notifications] = await Promise.all([
    readCatalogData(),
    getCatalogStats(),
    listShopCategoriesWithCounts(),
    listGlobalNotifications(1),
  ]);

  return NextResponse.json({ catalog, stats, categories, notifications });
}