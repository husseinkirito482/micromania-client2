"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { fadeInUp, snappyEase, staggerChildren } from "@/lib/animations";
import { motion } from "framer-motion";

const highlights = [
  "Livraison express 24h",
  "Editions collector garanties",
  "Bundles console exclusifs",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-16 pt-8 sm:pb-20 sm:pt-12">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-8%] top-20 h-72 w-72 rounded-full bg-cyan-400/18 blur-3xl" />
        <div className="absolute right-[-4%] top-10 h-96 w-96 rounded-full bg-violet-500/16 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-[#0b0f1a] to-transparent" />
      </div>

      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div
              variants={fadeInUp}
              className="mb-6 inline-flex items-center gap-3 rounded-full border border-cyan-300/18 bg-cyan-300/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/80"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(76,201,255,0.8)]" />
              Nouvelle generation gaming
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-[family-name:var(--font-orbitron)] text-5xl font-black uppercase leading-[0.95] tracking-[0.04em] text-white sm:text-6xl lg:text-7xl"
            >
              Entrez dans la <span className="text-glow text-cyan-300">meta</span> du gaming premium.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-2xl text-lg leading-7 text-[var(--muted)] sm:text-xl"
            >
              Consoles, accessoires et sorties AAA mis en scene dans une vitrine haut de gamme pensée pour les joueurs exigeants.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="#products" className="min-w-44">Explorer le store</Button>
              <Button href="#games" variant="secondary" className="min-w-44">
                Voir les sorties
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item} className="glass-panel rounded-2xl px-4 py-4 text-sm uppercase tracking-[0.18em] text-white/82">
                  {item}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.32, ease: snappyEase }}
            className="relative"
          >
            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-4 sm:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(76,201,255,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,77,109,0.12),transparent_22%)]" />
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(145deg,#131a30_0%,#0b1120_45%,#090d18_100%)] p-6">
                <div className="absolute inset-0 bg-[url('/games/phantom-grid.svg')] bg-cover bg-center opacity-55" />
                <div className="absolute inset-0 bg-linear-to-t from-[#090d18] via-[#090d18]/35 to-transparent" />

                <div className="relative flex min-h-[420px] flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Edition signature</p>
                      <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-black uppercase text-white">
                        Phantom Grid X
                      </h2>
                    </div>
                    <div className="rounded-full border border-red-400/30 bg-red-400/14 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-100">
                      -20%
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-end justify-between rounded-[1.5rem] border border-white/10 bg-black/28 px-5 py-4 backdrop-blur-sm">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-white/55">Bundle exclusif</p>
                        <p className="mt-2 text-3xl font-bold text-white">449,99 EUR</p>
                      </div>
                      <div className="text-right text-sm text-cyan-100/78">
                        <p>Console + casque + bonus</p>
                        <p>Stock limite</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/60">
                      <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.8)]" />
                      Disponible en precommande
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}