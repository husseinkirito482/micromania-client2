"use client";

import { useCart } from "@/components/cart/CartProvider";
import { snappyEase } from "@/lib/animations";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CART_ANCHOR_ID = "global-cart-anchor";

export function GlobalCartButton() {
  const pathname = usePathname();
  const { cartPulseToken, totalQuantity } = useCart();

  if (pathname === "/" || pathname === "/shop" || pathname === "/cart" || pathname === "/login" || pathname === "/auth/login" || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <motion.div
      animate={cartPulseToken > 0 ? { scale: [1, 1.1, 1] } : { scale: 1 }}
      transition={{ duration: 0.28, ease: snappyEase }}
      className="fixed right-4 top-4 z-[70] sm:right-6 sm:top-5"
    >
      <Link
        id={CART_ANCHOR_ID}
        href="/cart"
        aria-label="Mon panier"
        className="relative flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/24 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(8,12,24,0.98))] text-white shadow-[0_0_0_1px_rgba(76,201,255,0.12),0_10px_24px_rgba(3,6,16,0.28),0_0_24px_rgba(76,201,255,0.12)] backdrop-blur-xl transition duration-200 hover:border-cyan-300/36 hover:text-cyan-50 hover:shadow-[0_0_0_1px_rgba(76,201,255,0.18),0_14px_30px_rgba(3,6,16,0.34),0_0_28px_rgba(76,201,255,0.18)] sm:h-13 sm:w-13"
      >
        <ShoppingCart className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
        {totalQuantity > 0 ? (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border border-slate-950/50 bg-cyan-300 px-1 text-[10px] font-black text-slate-950 shadow-[0_6px_14px_rgba(76,201,255,0.24)]">
            {totalQuantity > 99 ? "99+" : totalQuantity}
          </span>
        ) : null}
      </Link>
    </motion.div>
  );
}