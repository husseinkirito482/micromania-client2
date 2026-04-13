"use client";

import { snappyEase } from "@/lib/animations";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
} & Omit<HTMLMotionProps<"button">, "children">;

const baseClassName =
  "inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition duration-150 sm:px-5 sm:py-3 sm:text-sm sm:tracking-[0.18em]";

const variants = {
  primary:
    "border-cyan-300/28 bg-linear-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 shadow-[0_0_28px_rgba(76,201,255,0.24)] hover:shadow-[0_0_34px_rgba(76,201,255,0.28)]",
  secondary:
    "border-white/12 bg-white/8 text-white shadow-[0_0_0_1px_rgba(76,201,255,0.06)] hover:border-cyan-300/35 hover:bg-white/12 hover:shadow-[0_0_24px_rgba(76,201,255,0.12)]",
  ghost:
    "border-white/10 bg-transparent text-white hover:border-violet-400/40 hover:bg-violet-400/10",
};

export function Button({
  children,
  className = "",
  href,
  variant = "primary",
  ...props
}: ButtonProps) {
  const { hoverDuration, hoverLift, hoverScale } = useMotionProfile();
  const classes = `${baseClassName} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <motion.a
        whileHover={{ scale: hoverScale, y: hoverLift, boxShadow: "0 0 22px rgba(76,201,255,0.18)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: hoverDuration, ease: snappyEase }}
        href={href}
        className={classes}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: hoverScale, y: hoverLift, boxShadow: "0 0 22px rgba(76,201,255,0.18)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: hoverDuration, ease: snappyEase }}
      className={classes}
      type="button"
      {...props}
    >
      {children}
    </motion.button>
  );
}