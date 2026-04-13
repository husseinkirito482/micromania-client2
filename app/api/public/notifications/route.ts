import { listGlobalNotifications } from "@/lib/catalog-store";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") || "1");
  const notifications = await listGlobalNotifications(page);
  return NextResponse.json(notifications);
}