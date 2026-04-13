"use client";

import { createRevealVariants, snappyEase } from "@/lib/animations";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { TopUpProduct } from "./types";

type SimilarProductsProps = {
  products: TopUpProduct[];
};

export function SimilarProducts({ products }: SimilarProductsProps) {
  const { isMobile } = useMotionProfile();
  const revealVariants = createRevealVariants(isMobile);

  if (products.length === 0) {
    return null;
  }

  return (
    <motion.section variants={revealVariants} className="pt-1">
      <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-4">
          {products.map((product) => (
            <motion.article
              key={product.slug}
              whileHover={{ y: -3, scale: 1.05 }}
              transition={{ duration: 0.18, ease: snappyEase }}
              className="group min-w-[240px] overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#0f172a] sm:min-w-[260px]"
            >
              <Link href={`/games/${product.slug}`} className="block">
                <div className="relative min-h-[220px] overflow-hidden bg-[#0b1325]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 240px, 260px"
                    className="object-cover transition duration-200 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-[#020617]/22 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200/78">{product.genre}</p>
                    <h3 className="mt-2 font-[family-name:var(--font-orbitron)] text-lg font-black uppercase text-white">{product.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-300/70">{product.description}</p>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
      <div className="mt-2 h-1 w-full rounded-full bg-white/10">
        <div className="h-1 w-20 rounded-full bg-white/20" />
      </div>
    </motion.section>
  );
}