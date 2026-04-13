"use client";

import { Button } from "@/components/ui/Button";
import { formatCartPrice, useCart } from "@/components/cart/CartProvider";
import { Container } from "@/components/ui/Container";
import { createRevealVariants, createScaleInVariants, createStaggerChildren, snappyEase } from "@/lib/animations";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items: cartItems, isReady, removeItem, totalAmount, updateItemQuantity } = useCart();
  const { hoverDuration, hoverScale, isMobile } = useMotionProfile();
  const revealVariants = createRevealVariants(isMobile);
  const staggerChildren = createStaggerChildren(isMobile);

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

          <motion.div variants={revealVariants} className="mb-7 sm:mb-8">
           
            <h1 className="mt-2 bg-linear-to-r from-violet-200 via-cyan-200 to-sky-300 bg-clip-text font-[family-name:var(--font-orbitron)] text-3xl font-black uppercase tracking-[0.05em] text-transparent sm:text-5xl lg:text-6xl">
              Panier
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62 sm:text-base sm:leading-7">
              Revoyez vos selections, ajustez les quantites et finalisez votre commande.
            </p>
          </motion.div>

          <div className="grid gap-4 xl:grid-cols-[1.45fr_0.55fr] xl:gap-5 xl:items-start">
            <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-3 sm:space-y-4">
              <AnimatePresence>
                {cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <motion.article
                      key={item.id}
                      layout
                      variants={createScaleInVariants(index, isMobile)}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -12, scale: 0.98, transition: { duration: 0.14, ease: snappyEase } }}
                      className="group relative overflow-hidden rounded-[1.15rem] border border-white/8 bg-[linear-gradient(180deg,rgba(14,19,34,0.9),rgba(8,12,22,0.98))] shadow-[0_10px_28px_rgba(3,6,16,0.34)] backdrop-blur-md sm:rounded-[1.35rem]"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(76,201,255,0.08),transparent_30%,rgba(139,92,246,0.08))] opacity-80" />
                      <div className="relative flex items-start gap-3 p-2.5 sm:gap-4 sm:p-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[0.9rem] border border-white/8 bg-black/18 sm:h-28 sm:w-28 sm:rounded-[1rem]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="112px"
                            className="object-contain p-2 transition duration-150 group-hover:scale-[1.03]"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100/62 sm:text-xs">
                                {item.category ?? "Produit"}
                              </p>
                              <h2 className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-white sm:text-xl">
                                {item.name}
                              </h2>
                              <p className="mt-2 text-sm font-semibold text-white/86 sm:text-base">
                                {formatCartPrice(item.price)}
                              </p>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.06, y: -1 }}
                              whileTap={{ scale: 0.92 }}
                              transition={{ duration: hoverDuration, ease: snappyEase }}
                              type="button"
                              aria-label={`Supprimer ${item.name}`}
                              onClick={() => removeItem(item.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/64 transition duration-150 hover:border-rose-300/28 hover:text-rose-100 hover:shadow-[0_0_20px_rgba(251,113,133,0.12)] sm:h-9 sm:w-9"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </motion.button>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="inline-flex items-center rounded-full border border-white/10 bg-black/20 p-1 shadow-[inset_0_0_18px_rgba(255,255,255,0.03)]">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.92 }}
                                transition={{ duration: 0.14, ease: snappyEase }}
                                type="button"
                                aria-label={`Diminuer ${item.name}`}
                                onClick={() => updateItemQuantity(item.id, "decrement")}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-white/78 transition duration-150 hover:bg-white/8 hover:text-white sm:h-9 sm:w-9"
                              >
                                <Minus className="h-4 w-4" />
                              </motion.button>

                              <div className="flex min-w-10 items-center justify-center px-2 text-center">
                                <AnimatePresence mode="wait" initial={false}>
                                  <motion.span
                                    key={`${item.id}-${item.quantity}`}
                                    initial={{ opacity: 0, y: 8, scale: 0.92 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.92 }}
                                    transition={{ duration: 0.14, ease: snappyEase }}
                                    className="text-sm font-bold text-white sm:text-base"
                                  >
                                    {item.quantity}
                                  </motion.span>
                                </AnimatePresence>
                              </div>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.92 }}
                                transition={{ duration: 0.14, ease: snappyEase }}
                                type="button"
                                aria-label={`Augmenter ${item.name}`}
                                onClick={() => updateItemQuantity(item.id, "increment")}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-white/78 transition duration-150 hover:bg-white/8 hover:text-white sm:h-9 sm:w-9"
                              >
                                <Plus className="h-4 w-4" />
                              </motion.button>
                            </div>

                            <p className="text-sm font-semibold text-cyan-100 sm:text-base">
                              {formatCartPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))
                ) : (
                  <motion.div
                    key="empty-cart"
                    initial={{ opacity: isReady ? 0 : 1, y: isReady ? 18 : 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2, ease: snappyEase }}
                    className="rounded-[1.15rem] border border-white/8 bg-white/[0.03] p-6 text-center shadow-[0_10px_28px_rgba(3,6,16,0.28)] backdrop-blur-md sm:rounded-[1.35rem] sm:p-8"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/18 bg-cyan-300/8 text-cyan-100 shadow-[0_0_24px_rgba(76,201,255,0.14)]">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-white">Votre panier est vide</h2>
                    <p className="mt-2 text-sm leading-6 text-white/58 sm:text-base">
                      Ajoutez quelques produits pour lancer votre commande.
                    </p>
                    <div className="mt-5">
                      <Button href="/shop" className="min-w-44 justify-center">
                        Explorer la boutique
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.aside
              variants={revealVariants}
              className="overflow-hidden rounded-[1.25rem] border border-white/8 bg-[linear-gradient(180deg,rgba(14,19,34,0.9),rgba(8,12,22,0.98))] p-4 shadow-[0_12px_30px_rgba(3,6,16,0.34)] backdrop-blur-xl sm:rounded-[1.5rem] sm:p-5 xl:sticky xl:top-24"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(130deg,rgba(76,201,255,0.08),transparent_30%,rgba(139,92,246,0.08))] opacity-80" />
              <div className="relative">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100/62 sm:text-xs">
                  
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">Montant</h2>

                <div className="mt-6 rounded-[1.25rem] border border-white/8 bg-black/18 p-4">
                  <div className="flex items-center justify-between gap-3 text-base font-bold text-white sm:text-lg">
                    <span>Total</span>
                    <span>{formatCartPrice(totalAmount)}</span>
                  </div>
                </div>

                <Button className="mt-5 w-full justify-center" disabled={cartItems.length === 0}>
                  Passer la commande
                </Button>

                <p className="mt-3 text-center text-xs leading-5 text-white/46 sm:text-sm">
                  Paiement securise.
                </p>
              </div>
            </motion.aside>
          </div>
        </motion.section>
      </Container>
    </main>
  );
}