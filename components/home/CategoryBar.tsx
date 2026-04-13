"use client";

import { Container } from "@/components/ui/Container";
import { fadeInUp } from "@/lib/animations";
import { motion } from "framer-motion";
import { Category } from "@/data/storefront";

type CategoryBarProps = {
  categories: Category[];
};

function CategoryIcon({ icon }: { icon: Category["icon"] }) {
  const common = "h-5 w-5";

  switch (icon) {
    case "controller":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M8 9.4H16C19.1 9.4 21 11.2 21 14.1C21 16.9 19.6 19 17.6 19C15.7 19 15.3 17.1 13.9 17.1H10.1C8.7 17.1 8.3 19 6.4 19C4.4 19 3 16.9 3 14.1C3 11.2 4.9 9.4 8 9.4Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8.2 13H10.8M9.5 11.7V14.3M15.7 12.2H15.71M17.7 14.2H17.71" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "headset":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M4.5 13.5V12C4.5 7.86 7.86 4.5 12 4.5C16.14 4.5 19.5 7.86 19.5 12V13.5" stroke="currentColor" strokeWidth="1.6" />
          <rect x="4" y="12" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <rect x="16" y="12" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "pc":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <rect x="4" y="5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 19H15M12 16V19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "gift":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M5 10H19V19H5V10Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 10V19M4 10H20M12 10H8.5C7.12 10 6 8.88 6 7.5C6 6.12 7.12 5 8.5 5C10.43 5 12 6.57 12 8.5V10ZM12 10H15.5C16.88 10 18 8.88 18 7.5C18 6.12 16.88 5 15.5 5C13.57 5 12 6.57 12 8.5V10Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "figure":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8.5 20V17.2C8.5 15.16 10.16 13.5 12.2 13.5H11.8C13.84 13.5 15.5 15.16 15.5 17.2V20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M5 12H19M12 5V19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
  }
}

export function CategoryBar({ categories }: CategoryBarProps) {
  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      className="sticky top-24 z-40"
    >
      <Container>
        <div className="glass-panel overflow-x-auto rounded-2xl px-3 py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-3">
            {categories.map((category) => (
              <a
                key={category.label}
                href="#"
                className="group flex items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/75 transition hover:border-cyan-300/22 hover:bg-cyan-300/8 hover:text-white"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-black/22 text-cyan-200/85 transition group-hover:shadow-[0_0_18px_rgba(76,201,255,0.24)]">
                  <CategoryIcon icon={category.icon} />
                </span>
                {category.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </motion.section>
  );
}