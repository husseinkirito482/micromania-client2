"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Game } from "@/data/storefront";
import { fadeInUp, snappyEase, staggerChildren } from "@/lib/animations";
import { motion } from "framer-motion";
import Image from "next/image";

type GamesSectionProps = {
  games: Game[];
};

export function GamesSection({ games }: GamesSectionProps) {
  return (
    <section id="games" className="py-20 sm:py-24">
      <Container>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-8 max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-200/70">Sorties AAA</p>
          <h2 className="section-title mt-3 text-3xl font-black uppercase text-white sm:text-4xl">
            Les univers qui marquent la saison
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            Cartes larges, surcouches profondes et appels a l’action nets pour mettre les licences en avant sans surcharger la page.
          </p>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
          className="grid gap-5 lg:grid-cols-3"
        >
          {games.map((game) => (
            <motion.article
              key={game.title}
              variants={fadeInUp}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.18, ease: snappyEase }}
              className="group glass-panel relative overflow-hidden rounded-[2rem]"
            >
              <div className="relative min-h-[420px] overflow-hidden">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover transition duration-200 group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#07101a] via-[#07101a]/34 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/74">{game.eyebrow}</p>
                  <h3 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-black uppercase text-white">
                    {game.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-base leading-7 text-white/72">{game.description}</p>
                  <div className="mt-6">
                    <Button href="#" variant="ghost">
                      Explorer
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}