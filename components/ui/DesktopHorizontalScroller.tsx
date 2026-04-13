"use client";

import { snappyEase } from "@/lib/animations";
import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

type DesktopHorizontalScrollerProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  indicatorLabel?: string;
};

function joinClasses(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function DesktopHorizontalScroller({
  children,
  className,
  contentClassName,
  indicatorLabel = "Faites defiler",
}: DesktopHorizontalScrollerProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) {
      return undefined;
    }

    const updateScrollState = () => {
      const maxScrollLeft = element.scrollWidth - element.clientWidth;
      const scrollLeft = element.scrollLeft;

      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(maxScrollLeft - scrollLeft > 10);
      setHasScrolled(scrollLeft > 20);
    };

    updateScrollState();

    element.addEventListener("scroll", updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(element);
    window.addEventListener("resize", updateScrollState);

    return () => {
      element.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [children]);

  return (
    <div className={joinClasses("relative hidden sm:block", className)}>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-4 left-0 z-10 w-20 bg-linear-to-r from-[rgba(7,16,29,0.96)] via-[rgba(7,16,29,0.74)] to-transparent transition duration-300 ${canScrollLeft ? "opacity-100" : "opacity-0"}`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-4 right-0 z-10 w-24 bg-linear-to-l from-[rgba(7,16,29,0.98)] via-[rgba(7,16,29,0.82)] to-transparent transition duration-300 ${canScrollRight ? "opacity-100" : "opacity-0"}`}
      />

      <div
        ref={scrollRef}
        className={joinClasses(
          "overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          contentClassName,
        )}
      >
        {children}
      </div>

      <motion.div
        aria-hidden="true"
        animate={
          prefersReducedMotion
            ? { opacity: canScrollRight ? (hasScrolled ? 0.34 : 0.84) : 0, scale: 1 }
            : {
                opacity: canScrollRight ? (hasScrolled ? 0.34 : 0.84) : 0,
                scale: canScrollRight ? [1, 1.03, 1] : 1,
                x: canScrollRight ? [0, 6, 0] : 0,
              }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0.18, ease: snappyEase }
            : { duration: 1.6, ease: snappyEase, repeat: Number.POSITIVE_INFINITY }
        }
        className="pointer-events-none absolute right-4 top-1/2 z-20 flex -translate-y-1/2 items-center gap-2 rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(11,17,31,0.88),rgba(8,13,24,0.96))] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/78 shadow-[0_14px_36px_rgba(3,6,16,0.3)] backdrop-blur-xl"
      >
        <span>{indicatorLabel}</span>
        <ChevronRight className="h-4 w-4 text-cyan-200" />
      </motion.div>
    </div>
  );
}