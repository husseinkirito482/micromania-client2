"use client";

import { DesktopHorizontalScroller } from "@/components/ui/DesktopHorizontalScroller";
import { Container } from "@/components/ui/Container";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type ActionItem = {
  id: string;
  title: string;
  image: string;
  category: string;
  href: string;
  accentClassName: string;
};

type RecentSectionProps = {
  title: string;
  items: ActionItem[];
  eyebrow: string;
  variant?: "default" | "topup" | "giftcard";
};

function SectionCard({ item, variant = "default" }: { item: ActionItem; variant?: "default" | "topup" | "giftcard" }) {
  if (variant === "topup") {
    return (
      <Link href={item.href} className="group block w-[7.9rem] shrink-0 snap-start sm:w-auto">
        <article className="overflow-hidden rounded-[1.05rem] border border-white/8 bg-[rgba(12,16,28,0.82)] p-2 shadow-none sm:rounded-[1.15rem] sm:border-white/10 sm:bg-[linear-gradient(180deg,rgba(15,20,36,0.92),rgba(8,12,24,0.98))] sm:p-2.5 sm:shadow-[0_14px_30px_rgba(3,6,16,0.22)]">
          <div className="relative aspect-square overflow-hidden rounded-[0.9rem] border border-white/8 bg-[rgba(9,13,22,0.92)] sm:rounded-[1rem] sm:bg-[linear-gradient(180deg,rgba(12,18,34,0.86),rgba(8,12,24,0.96))]">
            <div className={`pointer-events-none absolute inset-0 opacity-22 sm:opacity-50 sm:bg-linear-to-b ${item.accentClassName}`} />
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 150px, (max-width: 1024px) 25vw, 16vw"
              className="object-cover sm:transition sm:duration-200 sm:group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 sm:bg-[linear-gradient(180deg,transparent,rgba(8,12,24,0.12))]" />
          </div>

          <h3 className="mt-2 line-clamp-2 text-[13px] font-medium leading-5 text-white/88 sm:mt-3 sm:text-base">
            {item.title}
          </h3>
        </article>
      </Link>
    );
  }

  if (variant === "giftcard") {
    return (
      <Link href={item.href} className="group block w-[7.9rem] shrink-0 snap-start sm:w-auto">
        <article className="overflow-hidden rounded-[1.05rem] border border-white/8 bg-[rgba(12,16,28,0.82)] p-2 shadow-none sm:rounded-[1.15rem] sm:border-white/10 sm:bg-[linear-gradient(180deg,rgba(15,20,36,0.92),rgba(8,12,24,0.98))] sm:p-2.5 sm:shadow-[0_14px_30px_rgba(3,6,16,0.22)]">
          <div className="relative aspect-[1.42] overflow-hidden rounded-[0.8rem] border border-white/8 bg-[rgba(9,13,22,0.92)] sm:aspect-[0.98] sm:rounded-[0.95rem] sm:border-0 sm:bg-transparent">
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 125px, (max-width: 1024px) 25vw, 16vw"
              className="object-cover sm:transition sm:duration-200 sm:group-hover:scale-[1.03]"
            />
          </div>

          <h3 className="mt-2 line-clamp-2 text-[12px] font-medium leading-5 text-white/82 sm:mt-3 sm:text-base sm:text-white">
            {item.title}
          </h3>
        </article>
      </Link>
    );
  }

  return (
    <Link href={item.href} className="group block w-[11.2rem] shrink-0 snap-start sm:w-auto">
      <article className="relative overflow-hidden rounded-[1.1rem] border border-white/8 bg-[rgba(12,16,28,0.82)] shadow-none sm:rounded-[1.35rem] sm:border-white/10 sm:bg-[linear-gradient(180deg,rgba(15,20,36,0.9),rgba(8,12,24,0.98))] sm:shadow-[0_14px_30px_rgba(3,6,16,0.26)]">
        <div className={`pointer-events-none absolute inset-0 hidden sm:block sm:bg-linear-to-b ${item.accentClassName} sm:opacity-85`} />
        <div className="pointer-events-none absolute inset-0 hidden sm:block sm:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_24%,rgba(8,12,24,0.34)_100%)]" />

        <div className="relative p-2.5 sm:p-4">
          <div className="relative aspect-[1.02] overflow-hidden rounded-[1rem] border border-white/8 bg-[rgba(9,13,22,0.92)] sm:aspect-[1.04] sm:bg-[radial-gradient(circle_at_50%_24%,rgba(255,255,255,0.08),rgba(10,14,26,0.96)_72%)]">
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 180px, (max-width: 1024px) 33vw, 20vw"
              className="object-contain p-3 sm:transition sm:duration-200 sm:group-hover:scale-[1.03]"
            />
          </div>

          <div className="mt-2 sm:mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100/62">{item.category}</p>
            <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-medium leading-5 text-white/86 sm:text-base sm:font-semibold sm:text-white">
              {item.title}
            </h3>
          </div>
        </div>
      </article>
    </Link>
  );
}

function RecentSection({ title, items, eyebrow, variant = "default" }: RecentSectionProps) {
  return (
    <section className="py-5 sm:py-8">
      <div className="mb-3 flex items-end justify-between gap-3 sm:mb-5">
        <div className="text-left">
          <p className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100/62 sm:block sm:text-xs">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-left font-[family-name:var(--font-orbitron)] text-[11px] font-medium uppercase tracking-[0.08em] text-white/80 sm:text-3xl sm:font-black sm:tracking-[0.05em] sm:text-white">
            {title}
          </h2>
        </div>
      </div>

      <div className="relative sm:hidden">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <SectionCard key={item.id} item={item} variant={variant} />
          ))}
        </div>
      </div>

      {variant === "default" ? (
        <DesktopHorizontalScroller
          className="hidden sm:block"
          contentClassName="flex snap-x gap-4 px-1 lg:gap-5"
          indicatorLabel="Defiler"
        >
          {items.map((item) => (
            <div key={item.id} className="w-[17.5rem] shrink-0 snap-start lg:w-[18.5rem] xl:w-[19.5rem]">
              <SectionCard item={item} variant={variant} />
            </div>
          ))}
        </DesktopHorizontalScroller>
      ) : (
        <div className="hidden sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <SectionCard key={item.id} item={item} variant={variant} />
          ))}
        </div>
      )}
    </section>
  );
}

export function HomeRecentSections() {
  const [recentTopUps, setRecentTopUps] = useState<ActionItem[]>([]);
  const [recentGiftCards, setRecentGiftCards] = useState<ActionItem[]>([]);
  const [recentArticles, setRecentArticles] = useState<ActionItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/public/catalog", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: {
        latest: {
          topups: Array<{ id: string; slug: string; title: string; image: string; genre: string; accent: string }>;
          giftCards: Array<{ id: string; brand: string; amount: string; image: string; accent: string }>;
          shop: Array<{ id: string; title: string; image: string; category: string }>;
        };
      }) => {
        if (!isMounted) {
          return;
        }

        setRecentTopUps(
          payload.latest.topups.slice(0, 5).map((game) => ({
            id: game.id,
            title: game.title,
            image: game.image,
            category: game.genre,
            href: `/games/${game.slug}`,
            accentClassName: game.accent,
          })),
        );

        setRecentGiftCards(
          payload.latest.giftCards.slice(0, 5).map((card) => ({
            id: card.id,
            title: `${card.brand} ${card.amount}`,
            image: card.image,
            category: "Carte cadeau",
            href: `/gift-cards?card=${card.id}`,
            accentClassName: card.accent,
          })),
        );

        setRecentArticles(
          payload.latest.shop.slice(0, 10).map((product) => ({
            id: product.id,
            title: product.title,
            image: product.image,
            category: product.category,
            href: `/shop/${product.id}`,
            accentClassName: "from-cyan-400/18 via-sky-400/10 to-violet-500/18",
          })),
        );
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative pb-8 sm:pb-14">
      <Container className="px-4 sm:px-6 lg:px-8">
        <div className="space-y-1 sm:hidden">
          <RecentSection title="Nouveaux Top Up" eyebrow="Recents" items={recentTopUps} variant="topup" />
          <RecentSection title="Nos nouvelles cartes cadeaux" eyebrow="Cartes cadeaux" items={recentGiftCards} variant="giftcard" />
          <RecentSection title="Articles recents" eyebrow="Boutique" items={recentArticles} />
        </div>

        <div className="hidden space-y-2 sm:block">
          <RecentSection title="Nouveaux Top Up" eyebrow="Recents" items={recentTopUps} variant="topup" />
          <RecentSection title="Nos nouvelles cartes cadeaux" eyebrow="Cartes cadeaux" items={recentGiftCards} variant="giftcard" />
          <RecentSection title="Articles recents" eyebrow="Boutique" items={recentArticles} />
        </div>
      </Container>
    </section>
  );
}