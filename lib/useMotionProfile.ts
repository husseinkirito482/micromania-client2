"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = "(max-width: 767px)";

export function useMotionProfile() {
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);

    const updateValue = () => setIsMobile(mediaQuery.matches);

    updateValue();
    mediaQuery.addEventListener("change", updateValue);

    return () => mediaQuery.removeEventListener("change", updateValue);
  }, []);

  return {
    isMobile,
    prefersReducedMotion,
    revealDuration: isMobile ? 0.14 : 0.32,
    hoverDuration: isMobile ? 0.12 : 0.2,
    hoverScale: isMobile ? 1.015 : 1.04,
    hoverLift: isMobile ? -1 : -4,
    iconDelayStep: isMobile ? 0 : 0.04,
    sectionOffset: isMobile ? 0 : 20,
    allowAmbientMotion: !isMobile && !prefersReducedMotion,
  };
}