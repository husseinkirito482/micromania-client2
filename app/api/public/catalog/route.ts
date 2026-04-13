import { readCatalogData } from "@/lib/catalog-store";
import { NextResponse } from "next/server";

export async function GET() {
  const catalog = await readCatalogData();

  const latest = [...catalog.topups, ...catalog.giftCards, ...catalog.shop]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

  return NextResponse.json({
    catalog,
    latest: {
      topups: catalog.topups.slice().sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()),
      giftCards: catalog.giftCards
        .slice()
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()),
      shop: catalog.shop.slice().sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()),
      all: latest,
    },
  });
}