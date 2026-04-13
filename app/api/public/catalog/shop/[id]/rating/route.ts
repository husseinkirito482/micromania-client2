import { addShopProductRating } from "@/lib/catalog-store";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const payload = (await request.json()) as { rating?: number };

  try {
    const summary = await addShopProductRating(id, Number(payload.rating));
    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to rate product";
    const status = message === "Product not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}