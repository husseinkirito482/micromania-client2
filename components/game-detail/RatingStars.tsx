"use client";

import { snappyEase } from "@/lib/animations";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useMemo, useState } from "react";

type RatingStarsProps = {
  productKey: string;
};

const ratingStorageKey = "nova.topup-ratings";

function readRatings() {
  try {
    const rawValue = window.localStorage.getItem(ratingStorageKey);
    return rawValue ? (JSON.parse(rawValue) as Record<string, number[]>) : {};
  } catch {
    return {};
  }
}

export function RatingStars({ productKey }: RatingStarsProps) {
  const [ratings, setRatings] = useState<number[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    return readRatings()[productKey] ?? [];
  });
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [submittedRating, setSubmittedRating] = useState<number | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const nextRatings = readRatings()[productKey] ?? [];
    return nextRatings.at(-1) ?? null;
  });

  const average = useMemo(() => {
    if (ratings.length === 0) {
      return 0;
    }

    return ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
  }, [ratings]);

  const submitRating = (rating: number) => {
    const storedRatings = readRatings();
    const nextRatings = [...(storedRatings[productKey] ?? []), rating];

    storedRatings[productKey] = nextRatings;
    window.localStorage.setItem(ratingStorageKey, JSON.stringify(storedRatings));

    setRatings(nextRatings);
    setSubmittedRating(rating);
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/46">Note</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                const activeValue = hoveredValue ?? submittedRating ?? Math.round(average);
                const isActive = value <= activeValue;

                return (
                  <motion.button
                    key={value}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ duration: 0.16, ease: snappyEase }}
                    onMouseEnter={() => setHoveredValue(value)}
                    onMouseLeave={() => setHoveredValue(null)}
                    onClick={() => submitRating(value)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#111c31] text-white/72 transition duration-200 hover:border-emerald-400/40 hover:text-white"
                    aria-label={`Noter ${value} sur 5`}
                  >
                    <Star className={`h-4 w-4 ${isActive ? "fill-[#22c55e] text-[#22c55e]" : "text-white/28"}`} />
                  </motion.button>
                );
              })}
            </div>
            <span className="text-sm font-semibold text-white">{ratings.length > 0 ? average.toFixed(1) : "Aucune note"}</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#111c31] px-3 py-2 text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/42">Avis</p>
          <p className="mt-1 text-sm font-semibold text-white">{ratings.length}</p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-white/56">Design de notation simple, propre et rapide, en frontend uniquement.</p>
    </section>
  );
}