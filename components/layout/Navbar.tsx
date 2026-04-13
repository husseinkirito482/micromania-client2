"use client";

import { useCart } from "@/components/cart/CartProvider";
import { useGlobalNotifications } from "@/components/notifications/NotificationsProvider";
import { Container } from "@/components/ui/Container";
import { snappyEase } from "@/lib/animations";
import { Bell, Headset, ShoppingCart, UserCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartPulseToken, totalQuantity } = useCart();
  const { hasUnread, unreadCount } = useGlobalNotifications();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 hidden sm:block">
      <Container>
        <motion.nav
          animate={{
            backgroundColor: isScrolled ? "rgba(8, 14, 28, 0.92)" : "rgba(9, 16, 31, 0.8)",
            borderColor: isScrolled ? "rgba(123, 183, 255, 0.22)" : "rgba(123, 183, 255, 0.14)",
            backdropFilter: "blur(18px)",
            boxShadow: isScrolled ? "0 16px 38px rgba(0, 0, 0, 0.28), 0 0 24px rgba(76,201,255,0.08)" : "0 10px 30px rgba(0, 0, 0, 0.2)",
          }}
          transition={{ duration: 0.18, ease: snappyEase }}
          className="mt-3 flex h-14 items-center justify-between rounded-2xl border px-4 soft-neon-ring sm:mt-4 sm:h-20 sm:px-7"
        >
          <Link href="#top" className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_24px_rgba(76,201,255,0.24)] sm:h-11 sm:w-11">
              <span className="font-[family-name:var(--font-orbitron)] text-base font-black tracking-[0.2em] text-cyan-200 sm:text-lg">
                N
              </span>
            </div>
            <div>
              <p className="font-[family-name:var(--font-orbitron)] text-xs tracking-[0.34em] text-white/95 sm:text-sm sm:tracking-[0.4em]">
                
              </p>
             

              
                    <h1 className="text-base font-semibold tracking-[-0.01em] text-white sm:text-xl">SILVESTRE SHOP</h1>
            </div>
          </Link>

          <div className="flex items-center gap-2 text-white/88 sm:gap-3">
            <motion.div
              animate={cartPulseToken > 0 ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18, ease: snappyEase }}
            >
              <Link
                id="global-cart-anchor"
                href="/cart"
                aria-label="Mon panier"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/90 transition duration-150 hover:border-cyan-300/25 hover:bg-white/10 hover:shadow-[0_0_24px_rgba(76,201,255,0.14)] sm:h-11 sm:w-11"
              >
                <ShoppingCart className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                {totalQuantity > 0 ? (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border border-slate-950/50 bg-cyan-300 px-1 text-[10px] font-black text-slate-950 shadow-[0_6px_14px_rgba(76,201,255,0.24)]">
                    {totalQuantity > 99 ? "99+" : totalQuantity}
                  </span>
                ) : null}
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.16, ease: snappyEase }}
            >
              <Link
                href="https://wa.me/90572457"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Service client"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_0_20px_rgba(76,201,255,0.08)] transition duration-150 hover:border-cyan-300/28 hover:bg-white/10 hover:text-cyan-100 hover:shadow-[0_0_0_1px_rgba(76,201,255,0.14),0_0_28px_rgba(76,201,255,0.16)] sm:h-11 sm:w-11"
              >
                <Headset className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.16, ease: snappyEase }}
            >
              <Link
                href="/notifications"
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_0_20px_rgba(76,201,255,0.08)] transition duration-150 hover:border-cyan-300/28 hover:bg-white/10 hover:text-cyan-100 hover:shadow-[0_0_0_1px_rgba(76,201,255,0.14),0_0_28px_rgba(76,201,255,0.16)] sm:h-11 sm:w-11"
              >
                <Bell className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                {hasUnread ? (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border border-slate-950/55 bg-rose-500 px-1 text-[10px] font-black text-white shadow-[0_6px_14px_rgba(244,63,94,0.3)]">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                ) : null}
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.04, y: -1, boxShadow: "0 0 16px rgba(76,201,255,0.14)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.16, ease: snappyEase }}
            >
              <Link
                href="/auth/login"
                aria-label="Connexion"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_0_20px_rgba(76,201,255,0.08)] transition duration-150 hover:border-cyan-300/28 hover:bg-white/10 hover:text-cyan-100 hover:shadow-[0_0_0_1px_rgba(76,201,255,0.14),0_0_28px_rgba(76,201,255,0.16)] sm:h-11 sm:w-11"
              >
                <UserCircle2 className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </Link>
            </motion.div>
          </div>
        </motion.nav>
      </Container>

      <AnimatePresence>
        {isScrolled ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: snappyEase }}
            className="pointer-events-none absolute inset-x-0 top-full h-8 bg-linear-to-b from-slate-950/45 to-transparent"
          />
        ) : null}
      </AnimatePresence>
    </header>
  );
}