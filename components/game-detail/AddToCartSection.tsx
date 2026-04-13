"use client";

import { parseCartPrice, useCart } from "@/components/cart/CartProvider";
import { createRevealVariants, createScaleInVariants, createStaggerChildren, snappyEase } from "@/lib/animations";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { motion } from "framer-motion";
import { Check, ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TopUpOption, TopUpProduct } from "./types";

type AddToCartSectionProps = {
  product: TopUpProduct;
};

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isMobile, hoverDuration } = useMotionProfile();
  const revealVariants = createRevealVariants(isMobile);
  const staggerChildren = createStaggerChildren(isMobile);
  const [selectedOptionId, setSelectedOptionId] = useState(() => product.topUpOptions[0]?.id ?? "");
  const [feedback, setFeedback] = useState<"idle" | "added" | "buying">("idle");

  const selectedOption = product.topUpOptions.find((option) => option.id === selectedOptionId) ?? product.topUpOptions[0];

  const addSelectedItem = (sourceRect?: DOMRect | null) => {
    if (!selectedOption) {
      return;
    }

    addItem(
      {
        id: `${product.slug}-${selectedOption.id}`,
        name: `${product.title} - ${selectedOption.title}`,
        price: parseCartPrice(selectedOption.price),
        image: product.image,
        category: product.genre,
      },
      sourceRect,
    );
  };

  const showFeedback = (value: "added" | "buying") => {
    setFeedback(value);
    window.setTimeout(() => setFeedback("idle"), 1200);
  };

  const renderOptionCard = (option: TopUpOption, index: number) => {
    const isSelected = option.id === selectedOption?.id;

    return (
      <motion.button
        key={option.id}
        type="button"
        variants={createScaleInVariants(index, isMobile)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 1.02 }}
        transition={{ duration: hoverDuration, ease: snappyEase }}
        onClick={() => setSelectedOptionId(option.id)}
        className={`relative w-full overflow-hidden rounded-xl p-px text-left transition duration-200 ${isSelected ? "scale-[1.02] bg-[linear-gradient(135deg,rgba(168,85,247,0.88),rgba(236,72,153,0.88),rgba(59,130,246,0.88))] shadow-[0_0_20px_rgba(168,85,247,0.18)]" : "border border-white/10 bg-[#111c31] hover:border-white/20"}`}
      >
        <div className={`rounded-[calc(0.75rem-1px)] ${isSelected ? "bg-[#111827]" : "bg-[#111c31]"} px-4 py-4`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-200 sm:text-base">{option.title}</h3>
                {option.badge ? <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-300">{option.badge}</span> : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-400">{option.subtitle}</p>
            </div>
          </div>

          {isSelected ? (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gray-200">
              <Check className="h-3.5 w-3.5" />
              Selectionne
            </div>
          ) : null}
        </div>
      </motion.button>
    );
  };

  if (!selectedOption) {
    return null;
  }

  return (
    <>
      <motion.section variants={revealVariants} className="rounded-2xl border border-white/10 bg-[#0f172a] p-5 text-gray-200">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-sky-400" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">Packs disponibles</p>
        </div>

        <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="mt-4 grid gap-3">
          {product.topUpOptions.map(renderOptionCard)}
        </motion.div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.16, ease: snappyEase }}
            type="button"
            onClick={(event) => {
              addSelectedItem(event.currentTarget.getBoundingClientRect());
              showFeedback("buying");
              router.push("/cart");
            }}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(168,85,247,0.96),rgba(236,72,153,0.96),rgba(59,130,246,0.96))] px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_0_22px_rgba(168,85,247,0.18)] transition duration-200 hover:shadow-[0_0_28px_rgba(168,85,247,0.24)]"
          >
            {feedback === "buying" ? "Redirection..." : "Acheter maintenant"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.16, ease: snappyEase }}
            type="button"
            onClick={(event) => {
              addSelectedItem(event.currentTarget.getBoundingClientRect());
              showFeedback("added");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#111c31] px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-gray-200 transition duration-200 hover:border-white/20 hover:bg-[#16213a]"
          >
            <ShoppingCart className="h-4 w-4" />
            {feedback === "added" ? "Ajoute" : "Ajouter au panier"}
          </motion.button>
        </div>
      </motion.section>
    </>
  );
}