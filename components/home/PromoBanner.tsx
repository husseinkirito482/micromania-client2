"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { fadeInUp } from "@/lib/animations";
import { motion } from "framer-motion";

export function PromoBanner() {
  return (
    <section className="pb-20 pt-4 sm:pb-24">
      <Container>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="relative overflow-hidden rounded-[2rem] border border-cyan-300/14 bg-[linear-gradient(135deg,rgba(76,201,255,0.18),rgba(139,92,246,0.16)_34%,rgba(255,77,109,0.18)_100%)] px-6 py-10 shadow-[0_18px_60px_rgba(5,8,18,0.38)] sm:px-10"
        >
          <div className="absolute inset-y-0 right-[-8%] w-1/3 rounded-full bg-cyan-300/18 blur-3xl" />
          <div className="absolute left-[-2%] top-0 h-32 w-32 rounded-full bg-red-400/16 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100/72">Semaine promo</p>
              <h2 className="section-title mt-3 text-3xl font-black uppercase text-white sm:text-4xl">
                Jusqu’a -40% sur les setups streaming et accessoires elite.
              </h2>
              <p className="mt-4 text-lg leading-7 text-white/76">
                Activez les packs limites avant la prochaine vague de sorties et renforcez la valeur marchande de la home avec une banniere CTA pleine largeur.
              </p>
            </div>

            <Button href="#products" className="min-w-48 self-start lg:self-center">
              Profiter des offres
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}