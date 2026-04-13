"use client";

import { createRevealVariants } from "@/lib/animations";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { motion } from "framer-motion";
import type { TopUpProduct } from "./types";

type ProductInfoProps = {
  product: TopUpProduct;
};

export function ProductInfo({ product }: ProductInfoProps) {
  const { isMobile } = useMotionProfile();
  const revealVariants = createRevealVariants(isMobile);

  return (
    <motion.section variants={revealVariants} className="hidden md:block">
      <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-5 text-gray-200">
        <div className="hidden flex-wrap items-center gap-2 md:flex">
          <span className="rounded-xl border border-sky-400/25 bg-sky-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200">{product.genre}</span>
          <span className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">{product.subtitle}</span>
        </div>

        <h1 className="hidden md:block md:mt-4 md:font-[family-name:var(--font-orbitron)] md:text-3xl md:font-black md:uppercase md:leading-tight md:text-white lg:text-[2.6rem]">{product.title}</h1>
        <p className="text-sm leading-7 text-gray-300 md:mt-4 sm:text-[15px]">{product.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {product.purchaseHighlights.map((highlight) => (
            <span key={highlight} className="rounded-xl border border-white/10 bg-[#111c31] px-3 py-2 text-[11px] font-medium text-gray-300">
              {highlight}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}