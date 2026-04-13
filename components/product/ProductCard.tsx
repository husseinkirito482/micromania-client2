"use client";

import { parseCartPrice, useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { Product } from "@/data/storefront";
import { snappyEase } from "@/lib/animations";
import { motion } from "framer-motion";
import Image from "next/image";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.02, boxShadow: "0 18px 34px rgba(3, 6, 16, 0.28)" }}
      transition={{ duration: 0.18, ease: snappyEase }}
      whileTap={{ scale: 0.985 }}
      className="group glass-panel overflow-hidden rounded-[1.25rem] sm:rounded-[1.7rem]"
    >
      <div className="relative aspect-square overflow-hidden border-b border-white/8 bg-black/20 sm:aspect-[4/4.3]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-3 transition duration-200 group-hover:scale-[1.03] sm:p-4 sm:group-hover:scale-[1.05]"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#09101d] via-transparent to-transparent" />
        <div className="absolute left-2.5 top-2.5 rounded-full border border-white/10 bg-black/35 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-100/82 backdrop-blur-sm sm:left-4 sm:top-4 sm:px-3 sm:text-[11px] sm:tracking-[0.18em]">
          {product.platform}
        </div>
      </div>

      <div className="space-y-3 p-3 sm:space-y-4 sm:p-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/48 sm:text-xs sm:tracking-[0.18em]">{product.category}</p>
          <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-white sm:mt-2 sm:min-h-0 sm:text-xl">
            {product.name}
          </h3>
        </div>

        <div className="flex items-end justify-between gap-2 sm:gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/45 sm:text-xs sm:tracking-[0.16em]">Prix</p>
            <p className="text-base font-bold text-white sm:text-2xl">{product.price}</p>
          </div>
          <div className="rounded-full border border-red-400/22 bg-red-400/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-red-100/90 sm:px-3 sm:text-[11px] sm:tracking-[0.18em]">
            {product.badge}
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={(event) =>
            addItem({
              id: product.id,
              name: product.name,
              price: parseCartPrice(product.price),
              image: product.image,
              category: product.category,
            }, event.currentTarget.getBoundingClientRect())
          }
          className="w-full justify-center px-3 py-2.5 text-[11px] tracking-[0.14em] sm:px-5 sm:py-3 sm:text-sm sm:tracking-[0.18em]"
        >
          Ajouter au panier
        </Button>
      </div>
    </motion.article>
  );
}