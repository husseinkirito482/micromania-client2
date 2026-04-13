"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = "(max-width: 767px)";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const isMobile = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => undefined;
      }

      const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);

      mediaQuery.addEventListener("change", onStoreChange);

      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    () => (typeof window !== "undefined" ? window.matchMedia(MOBILE_BREAKPOINT).matches : false),
    () => false,
  );
  const transitionDuration = prefersReducedMotion ? 0.01 : isMobile ? 0.22 : 0.24;
  const initialState = prefersReducedMotion ? { opacity: 1, y: 0 } : isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 8 };
  const animateState = { opacity: 1, y: 0 };
  const exitState = prefersReducedMotion ? { opacity: 1, y: 0 } : isMobile ? { opacity: 0 } : { opacity: 0, y: -8 };

  if (!isMounted) {
    return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-clip">
      <AnimatePresence mode={isMobile ? "wait" : "sync"} initial={false}>
        <motion.div
          key={pathname}
          initial={initialState}
          animate={animateState}
          exit={exitState}
          transition={{ duration: transitionDuration, ease: "easeOut" }}
          className="flex min-h-full flex-1 flex-col will-change-transform"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}