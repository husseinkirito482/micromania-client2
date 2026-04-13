"use client";

import { parseCartPrice, useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DesktopHorizontalScroller } from "@/components/ui/DesktopHorizontalScroller";
import { StoreSearchBar } from "@/components/ui/StoreSearchBar";
import { createRevealVariants, createScaleInVariants, createStaggerChildren, snappyEase } from "@/lib/animations";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { ArrowLeft, Gift } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

type CatalogGiftCard = {
  id: string;
  brand: string;
  amount: string;
  accent: string;
  badge: string;
  mono: string;
  image: string;
};

type GiftCardTileProps = {
  card: CatalogGiftCard;
  index: number;
  isMobile: boolean;
  hoverDuration: number;
  hoverScale: number;
  addItem: ReturnType<typeof useCart>["addItem"];
};

function GiftCardTile({ card, index, isMobile, hoverDuration, hoverScale, addItem }: GiftCardTileProps) {
  return (
    <motion.article
      variants={createScaleInVariants(index, isMobile)}
      whileHover={isMobile ? undefined : { scale: hoverScale, y: -4 }}
      transition={{ duration: hoverDuration, ease: snappyEase }}
      className="group relative overflow-hidden rounded-[1.15rem] border border-white/8 bg-[linear-gradient(180deg,rgba(14,19,34,0.9),rgba(8,12,22,0.98))] shadow-[0_10px_28px_rgba(3,6,16,0.34)] backdrop-blur-md sm:rounded-[1.35rem]"
    >
      <div className={`pointer-events-none absolute inset-0 bg-linear-to-b ${card.accent} opacity-85`} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_24%,rgba(9,14,26,0.4)_100%)] opacity-90" />

      <div className="relative p-2 sm:p-4">
        <div className="relative flex aspect-[1.05] items-center justify-center overflow-hidden rounded-[0.95rem] border border-white/8 bg-[radial-gradient(circle_at_50%_24%,rgba(255,255,255,0.08),rgba(10,14,26,0.96)_72%)] sm:rounded-[1.1rem]">
          <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.04),transparent_38%,rgba(255,255,255,0.02))]" />
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/6 blur-2xl transition duration-150 group-hover:bg-white/10" />
          <div className="relative flex flex-col items-center gap-2 text-center">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/24 text-xs font-black tracking-[0.2em] shadow-[0_0_22px_rgba(255,255,255,0.06)] sm:h-14 sm:w-14 sm:rounded-2xl sm:text-base ${card.mono}`}>
              {card.badge}
            </span>
            <div className="flex items-center gap-1 text-white/60">
              <Gift className="h-3.5 w-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-xs">Digital</span>
            </div>
          </div>
        </div>

        <div className="mt-2.5 space-y-2 sm:mt-4">
          <div>
            <p className="line-clamp-2 text-xs font-bold leading-5 text-white sm:text-lg">
              {card.brand}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-cyan-100/62 sm:mt-1 sm:text-[11px] sm:tracking-[0.16em]">
              Carte cadeau
            </p>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/42 sm:text-xs">Montant</p>
              <p className="mt-1 text-sm font-bold text-white sm:text-2xl">{card.amount}</p>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={(event) =>
              addItem({
                id: card.id,
                name: `${card.brand} ${card.amount}`,
                price: parseCartPrice(card.amount),
                image: card.image,
                category: "Carte cadeau",
              }, event.currentTarget.getBoundingClientRect())
            }
            className="w-full justify-center px-3 py-2.5 text-[10px] tracking-[0.14em] sm:py-3 sm:text-sm"
          >
            Acheter
          </Button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[1.15rem] ring-1 ring-inset ring-white/5 transition duration-150 group-hover:ring-cyan-300/18 sm:rounded-[1.35rem]" />
      <div className="pointer-events-none absolute -bottom-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-fuchsia-300/0 blur-3xl transition duration-150 group-hover:bg-fuchsia-300/12" />
    </motion.article>
  );
}

export default function GiftCardsPage() {
  const { addItem } = useCart();
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<CatalogGiftCard[]>([]);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const { hoverDuration, hoverScale, isMobile } = useMotionProfile();
  const revealVariants = createRevealVariants(isMobile);
  const staggerChildren = createStaggerChildren(isMobile);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/public/catalog", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { catalog: { giftCards: CatalogGiftCard[] } }) => {
        if (isMounted) {
          setCards(payload.catalog.giftCards);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredGiftCards = useMemo(() => {
    if (!deferredQuery) {
      return cards;
    }

    return cards.filter((card) => `${card.brand} ${card.amount}`.toLowerCase().includes(deferredQuery));
  }, [cards, deferredQuery]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] pb-12 pt-5 text-[var(--foreground)] sm:pb-16 sm:pt-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(76,201,255,0.12),transparent_22%),radial-gradient(circle_at_84%_10%,rgba(139,92,246,0.18),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(255,77,109,0.08),transparent_30%)]" />
      <div className="pointer-events-none absolute -left-14 top-12 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl sm:h-56 sm:w-56" />
      <div className="pointer-events-none absolute -right-14 top-8 h-52 w-52 rounded-full bg-violet-500/12 blur-3xl sm:h-64 sm:w-64" />

      <Container className="relative px-4 sm:px-6 lg:px-8">
        <motion.section initial="hidden" animate="visible" variants={revealVariants} className="mx-auto max-w-[1440px]">
          <motion.div variants={revealVariants} className="mb-4 flex items-center justify-start sm:mb-6">
            <motion.div whileHover={{ scale: hoverScale, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                aria-label="Retour a l'accueil"
                className="group flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/20 bg-white/8 text-cyan-100 shadow-[0_0_0_1px_rgba(76,201,255,0.1),0_0_22px_rgba(76,201,255,0.08)] backdrop-blur-md transition duration-150 hover:border-cyan-300/38 hover:text-white hover:shadow-[0_0_0_1px_rgba(76,201,255,0.16),0_0_30px_rgba(76,201,255,0.16)] sm:h-11 sm:w-11"
              >
                <ArrowLeft className="h-4.5 w-4.5 transition duration-150 group-hover:-translate-x-0.5 sm:h-5 sm:w-5" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={revealVariants} className="mb-6 space-y-4 sm:mb-8">
            <h1 className="mt-2 bg-linear-to-r from-violet-200 via-cyan-200 to-rose-200 bg-clip-text font-[family-name:var(--font-orbitron)] text-3xl font-black uppercase tracking-[0.05em] text-transparent sm:text-5xl lg:text-6xl">
                           Cartes cadeaux
            </h1>
           
          </motion.div>

          <StoreSearchBar
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher une carte cadeau..."
            className="mb-6 sm:mb-8"
          />

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3 sm:hidden"
          >
            {filteredGiftCards.map((card, index) => (
              <GiftCardTile
                key={`${card.brand}-${card.amount}`}
                card={card}
                index={index}
                isMobile={isMobile}
                hoverDuration={hoverDuration}
                hoverScale={hoverScale}
                addItem={addItem}
              />
            ))}
          </motion.div>

          <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="hidden sm:block">
            <DesktopHorizontalScroller contentClassName="flex gap-5 px-1" indicatorLabel="Parcourir">
              {filteredGiftCards.map((card, index) => (
                <div key={`${card.brand}-${card.amount}`} className="w-[18rem] shrink-0 lg:w-[19rem] xl:w-[20rem]">
                  <GiftCardTile
                    card={card}
                    index={index}
                    isMobile={false}
                    hoverDuration={hoverDuration}
                    hoverScale={hoverScale}
                    addItem={addItem}
                  />
                </div>
              ))}
            </DesktopHorizontalScroller>
          </motion.div>

          {filteredGiftCards.length === 0 ? (
            <motion.div
              variants={revealVariants}
              className="mt-8 rounded-[1.4rem] border border-white/8 bg-white/[0.03] px-5 py-8 text-center text-sm text-white/62 backdrop-blur-md"
            >
              Aucune carte cadeau ne correspond a votre recherche.
            </motion.div>
          ) : null}
        </motion.section>
      </Container>
    </main>
  );
}