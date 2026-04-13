"use client";

import { useCart } from "@/components/cart/CartProvider";
import { snappyEase } from "@/lib/animations";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export function CartAnimationLayer() {
  const { animationItems, completeAnimation } = useCart();

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      {animationItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: item.deltaX,
            y: item.deltaY,
            scale: 0.42,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.64, ease: snappyEase }}
          onAnimationComplete={() => completeAnimation(item.id)}
          style={{
            top: item.startY - 22,
            left: item.startX - 22,
          }}
          className="absolute flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/24 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(8,12,24,1))] shadow-[0_12px_30px_rgba(3,6,16,0.34),0_0_26px_rgba(76,201,255,0.18)]"
        >
          <div
            className="absolute inset-[3px] rounded-full bg-cover bg-center opacity-75"
            style={{ backgroundImage: `url(${item.image})` }}
          />
          <div className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
          <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-black/34 text-cyan-50 backdrop-blur-sm">
            <ShoppingCart className="h-3.5 w-3.5" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}