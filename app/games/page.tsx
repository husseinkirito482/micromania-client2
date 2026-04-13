"use client";

import { Container } from "@/components/ui/Container";
import { StoreSearchBar } from "@/components/ui/StoreSearchBar";
import { createRevealVariants, createScaleInVariants, createStaggerChildren, snappyEase } from "@/lib/animations";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";

const gameBannerImages = ["/image.png", "/image%20copy.png"];

type CatalogTopUpCard = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  genre: string;
  image: string;
  accent: string;
  glow: string;
};

export default function GamesPage() {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [isBannerPaused, setIsBannerPaused] = useState(false);
  const [query, setQuery] = useState("");
  const [games, setGames] = useState<CatalogTopUpCard[]>([]);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const { hoverDuration, hoverScale, isMobile } = useMotionProfile();
  const revealVariants = createRevealVariants(isMobile);
  const staggerChildren = createStaggerChildren(isMobile);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/public/catalog", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { catalog: { topups: CatalogTopUpCard[] } }) => {
        if (isMounted) {
          setGames(payload.catalog.topups);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isBannerPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveBannerIndex((currentIndex) => (currentIndex + 1) % gameBannerImages.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [isBannerPaused]);

  const filteredGames = games.filter(({ title, genre, subtitle }) => {
    if (!deferredQuery) {
      return true;
    }

    return `${title} ${genre} ${subtitle}`.toLowerCase().includes(deferredQuery);
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] pb-12 pt-5 text-[var(--foreground)] sm:pb-16 sm:pt-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(76,201,255,0.12),transparent_22%),radial-gradient(circle_at_86%_10%,rgba(139,92,246,0.18),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(255,77,109,0.08),transparent_28%)]" />
      <div className="pointer-events-none absolute -left-16 top-16 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl sm:h-56 sm:w-56" />
      <div className="pointer-events-none absolute -right-16 top-12 h-52 w-52 rounded-full bg-violet-500/12 blur-3xl sm:h-64 sm:w-64" />

      <Container className="relative px-4 sm:px-6 lg:px-10 xl:px-14">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="mx-auto hidden max-w-[1320px] lg:block"
        >
          <div className="relative mb-6 flex min-h-11 items-center justify-between">
            <Link
              href="/"
              aria-label="Retour a l'accueil"
              className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/20 bg-white/8 text-cyan-100 shadow-[0_0_0_1px_rgba(76,201,255,0.1),0_0_22px_rgba(76,201,255,0.08)] backdrop-blur-md outline-none transition duration-150 hover:border-cyan-300/38 hover:text-white hover:shadow-[0_0_0_1px_rgba(76,201,255,0.16),0_0_30px_rgba(76,201,255,0.16)] focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <h1 className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center font-[family-name:var(--font-orbitron)] text-base font-bold uppercase tracking-[0.2em] text-white">
              SILVESTRE TOP UP
            </h1>

            <div className="h-11 w-11 shrink-0" aria-hidden="true" />
          </div>

          <motion.div
            variants={revealVariants}
            className="group mb-6 overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,19,34,0.88),rgba(8,12,22,0.98))] shadow-[0_16px_38px_rgba(3,6,16,0.28)] backdrop-blur-xl"
            onMouseEnter={() => setIsBannerPaused(true)}
            onMouseLeave={() => setIsBannerPaused(false)}
          >
            <div className="relative h-40">
              <motion.div
                animate={{ x: `-${activeBannerIndex * 100}%` }}
                transition={{ duration: 0.85, ease: [0.42, 0, 0.58, 1] }}
                className="flex h-full w-full"
              >
                {gameBannerImages.map((image, index) => (
                  <div key={image} className="relative h-full min-w-full shrink-0 overflow-hidden">
                    <Image
                      src={image}
                      alt={`Banniere jeux ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1280px) 92vw, 1180px"
                      className="object-cover object-center"
                    />
                  </div>
                ))}
              </motion.div>

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.08),rgba(7,10,18,0.3)),linear-gradient(90deg,rgba(7,10,18,0.16),transparent_30%,transparent_70%,rgba(7,10,18,0.16))]" />
              <div className="pointer-events-none absolute inset-y-0 left-[8%] w-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.1),transparent)] blur-2xl" />
            </div>
          </motion.div>

          <StoreSearchBar
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un jeu..."
            className="mb-5 w-full"
          />

          <div className="pointer-events-none relative mb-6 h-[2px] overflow-visible">
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.68)_18%,rgba(168,85,247,0.72)_52%,rgba(244,63,94,0.62)_82%,transparent)]" />
            <div className="absolute left-1/2 top-1/2 h-4 w-44 -translate-x-1/2 -translate-y-1/2 bg-cyan-400/18 blur-xl" />
            <div className="absolute left-1/2 top-1/2 h-4 w-36 -translate-x-1/2 -translate-y-1/2 bg-fuchsia-500/14 blur-xl" />
          </div>
        </motion.section>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="fixed inset-x-0 top-0 z-40 lg:hidden"
        >
          <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,rgba(4,8,20,0.96),rgba(5,9,18,0.9),rgba(5,9,18,0.68),rgba(5,9,18,0))] backdrop-blur-xl" />
          <div className="relative mx-auto max-w-[1320px] px-4 pt-4 sm:px-6 sm:pt-5 lg:px-10 xl:px-14">
            <div className="relative mb-4 flex min-h-9 items-center justify-between sm:mb-6 sm:min-h-11">
            <Link
              href="/"
              aria-label="Retour a l'accueil"
              className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/20 bg-white/8 text-cyan-100 shadow-[0_0_0_1px_rgba(76,201,255,0.1),0_0_22px_rgba(76,201,255,0.08)] backdrop-blur-md outline-none transition duration-150 hover:border-cyan-300/38 hover:text-white hover:shadow-[0_0_0_1px_rgba(76,201,255,0.16),0_0_30px_rgba(76,201,255,0.16)] focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:scale-95 sm:h-11 sm:w-11"
            >
              <ArrowLeft className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </Link>

            <h1 className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center font-[family-name:var(--font-orbitron)] text-[11px] font-bold uppercase tracking-[0.18em] text-white sm:text-base sm:tracking-[0.2em]">
              SILVESTRE TOP UP
            </h1>

            <div className="h-8 w-8 shrink-0 sm:h-11 sm:w-11" aria-hidden="true" />
          </div>

          <motion.div
            variants={revealVariants}
            className="group mb-5 overflow-hidden rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,19,34,0.88),rgba(8,12,22,0.98))] shadow-[0_16px_38px_rgba(3,6,16,0.28)] backdrop-blur-xl sm:mb-8 sm:rounded-[1.9rem]"
            onMouseEnter={() => setIsBannerPaused(true)}
            onMouseLeave={() => setIsBannerPaused(false)}
          >
            <div className="relative h-28 sm:h-36 lg:h-40">
              <motion.div
                animate={{ x: `-${activeBannerIndex * 100}%` }}
                transition={{ duration: isMobile ? 0.5 : 0.85, ease: [0.42, 0, 0.58, 1] }}
                className="flex h-full w-full"
              >
                {gameBannerImages.map((image, index) => (
                  <div key={image} className="relative h-full min-w-full shrink-0 overflow-hidden">
                    <Image
                      src={image}
                      alt={`Banniere jeux ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 92vw, 1180px"
                      className="object-cover object-center"
                    />
                  </div>
                ))}
              </motion.div>

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.08),rgba(7,10,18,0.3)),linear-gradient(90deg,rgba(7,10,18,0.16),transparent_30%,transparent_70%,rgba(7,10,18,0.16))]" />
              <div className="pointer-events-none absolute inset-y-0 left-[8%] w-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.1),transparent)] blur-2xl" />
            </div>
          </motion.div>

          <StoreSearchBar
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un jeu..."
            className="mb-4 w-full sm:mb-6"
          />

            <div className="pointer-events-none relative h-[2px] overflow-visible">
              <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.68)_18%,rgba(168,85,247,0.72)_52%,rgba(244,63,94,0.62)_82%,transparent)]" />
              <div className="absolute left-1/2 top-1/2 h-4 w-44 -translate-x-1/2 -translate-y-1/2 bg-cyan-400/18 blur-xl" />
              <div className="absolute left-1/2 top-1/2 h-4 w-36 -translate-x-1/2 -translate-y-1/2 bg-fuchsia-500/14 blur-xl" />
            </div>
          </div>
        </motion.div>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="mx-auto max-w-[1320px] pt-[17.5rem] sm:pt-[22rem] lg:pt-0"
        >
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-4 xl:grid-cols-4 xl:gap-5"
          >
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.slug}
                variants={createScaleInVariants(index, isMobile)}
                whileHover={{ scale: hoverScale, y: isMobile ? -1 : -3 }}
                transition={{ duration: hoverDuration, ease: snappyEase }}
              >
                <Link href={`/games/${game.slug}`} className="group block">
                  <article className={`relative overflow-hidden rounded-[1.1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,19,34,0.9),rgba(8,12,22,0.98))] p-2 shadow-[0_12px_30px_rgba(3,6,16,0.3)] backdrop-blur-xl transition duration-150 hover:border-cyan-300/24 sm:rounded-[1.3rem] sm:p-2.5 ${game.glow}`}>
                    <div className="absolute inset-0 rounded-[1.3rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_24%,rgba(6,10,18,0.42)_100%)] opacity-90" />
                    <div className={`absolute inset-0 rounded-[1.3rem] bg-linear-to-b ${game.accent} opacity-75`} />

                    <div className="relative space-y-2">
                      <div className="relative aspect-square overflow-hidden rounded-[0.9rem] border border-white/10 bg-black/22 sm:rounded-[1rem]">
                        <Image
                          src={game.image}
                          alt={game.title}
                          fill
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                          className="object-cover transition duration-150 group-hover:scale-[1.05]"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.06),rgba(7,10,18,0.44))]" />
                        <div className="absolute inset-x-0 top-0 h-14 bg-linear-to-b from-white/10 to-transparent" />
                      </div>

                      <div className="px-0.5 pb-0.5">
                        <h2 className="line-clamp-1 text-center text-[10px] font-bold leading-4 text-white transition duration-150 group-hover:text-cyan-50 sm:text-sm sm:leading-5">
                          {game.title}
                        </h2>
                        <p className="mt-1 line-clamp-1 text-center text-[8px] font-medium uppercase tracking-[0.14em] text-white/48 sm:text-[10px]">
                          {game.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="pointer-events-none absolute inset-0 rounded-[1.3rem] ring-1 ring-inset ring-white/6 transition duration-200 group-hover:ring-cyan-300/18" />
                    <div className="pointer-events-none absolute inset-x-6 bottom-2 h-7 rounded-full bg-cyan-300/0 blur-2xl transition duration-200 group-hover:bg-cyan-300/12" />
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredGames.length === 0 ? (
            <motion.div
              variants={revealVariants}
              className="mt-8 rounded-[1.4rem] border border-white/8 bg-white/[0.03] px-5 py-8 text-center text-sm text-white/62 backdrop-blur-md"
            >
              Aucun jeu ne correspond a votre recherche.
            </motion.div>
          ) : null}
        </motion.section>
      </Container>
    </main>
  );
}