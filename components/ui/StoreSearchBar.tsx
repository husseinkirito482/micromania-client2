"use client";

import { snappyEase } from "@/lib/animations";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { ChangeEvent, useState } from "react";

type StoreSearchBarProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
};

export function StoreSearchBar({ value, onChange, placeholder, className = "" }: StoreSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      animate={{ scale: isFocused ? 1.005 : 1 }}
      transition={{ duration: 0.14, ease: snappyEase }}
      className={className}
    >
      <label className="group relative block">
        <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-cyan-100/58 transition duration-150 group-focus-within:text-cyan-100">
          <Search className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
        </span>
        <input
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          type="search"
          placeholder={placeholder}
          className="w-full rounded-2xl border border-cyan-300/16 bg-[linear-gradient(180deg,rgba(15,23,42,0.72),rgba(7,10,18,0.92))] py-3 pl-11 pr-4 text-sm text-white shadow-[0_0_0_1px_rgba(139,92,246,0.08),0_14px_34px_rgba(3,6,16,0.34)] outline-none backdrop-blur-xl transition duration-150 placeholder:text-white/34 focus:border-cyan-300/34 focus:shadow-[0_0_0_1px_rgba(76,201,255,0.18),0_0_26px_rgba(76,201,255,0.12),0_18px_38px_rgba(3,6,16,0.42)] sm:rounded-[1.35rem] sm:py-4 sm:pl-12 sm:text-base"
        />
        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(120deg,rgba(255,255,255,0.05),transparent_24%,transparent_76%,rgba(76,201,255,0.06))] opacity-70 sm:rounded-[1.35rem]" />
      </label>
    </motion.div>
  );
}