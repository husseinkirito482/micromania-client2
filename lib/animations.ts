import type { Variants } from "framer-motion";

export const snappyEase = [0.22, 1, 0.36, 1] as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.24,
      ease: snappyEase,
    },
  },
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export function createRevealVariants(isMobile: boolean): Variants {
  if (isMobile) {
    return {
      hidden: { opacity: 1, y: 0 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.01,
          ease: snappyEase,
        },
      },
    };
  }

  return {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.32,
        ease: snappyEase,
      },
    },
  };
}

export function createStaggerChildren(isMobile: boolean): Variants {
  if (isMobile) {
    return {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0,
          delayChildren: 0,
        },
      },
    };
  }

  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.03,
      },
    },
  };
}

export function createScaleInVariants(index: number, isMobile: boolean): Variants {
  if (isMobile) {
    return {
      hidden: { opacity: 1, scale: 1, y: 0 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: 0.01,
          ease: snappyEase,
        },
      },
    };
  }

  const delayStep = isMobile ? 0.02 : 0.04;

  return {
    hidden: { opacity: 0, scale: 0.95, y: 14 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: Math.min(index * delayStep, 0.2),
        duration: 0.28,
        ease: snappyEase,
      },
    },
  };
}