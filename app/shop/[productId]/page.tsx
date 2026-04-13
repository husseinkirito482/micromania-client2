import { readCatalogData } from "@/lib/catalog-store";
import { notFound } from "next/navigation";
import { ShopProductDetailView } from "./ShopProductDetailView";

type ShopProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function ShopProductPage({ params }: ShopProductPageProps) {
  const { productId } = await params;
  const catalog = await readCatalogData();
  const product = catalog.shop.find((item) => item.id === productId);

  if (!product) {
    notFound();
  }

  const similarProducts = catalog.shop
    .filter((item) => item.id !== product.id)
    .sort((left, right) => {
      const leftScore = Number(left.categoryId === product.categoryId);
      const rightScore = Number(right.categoryId === product.categoryId);

      if (leftScore !== rightScore) {
        return rightScore - leftScore;
      }

      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    })
    .slice(0, 8);

  return <ShopProductDetailView product={product} similarProducts={similarProducts} />;
}