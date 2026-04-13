"use client";

import { AddToCartSection } from "@/components/game-detail/AddToCartSection";
import { ProductDetailSkeleton } from "@/components/game-detail/ProductDetailSkeleton";
import { ProductGallery } from "@/components/game-detail/ProductGallery";
import { ProductInfo } from "@/components/game-detail/ProductInfo";
import { RatingStars } from "@/components/game-detail/RatingStars";
import { SimilarProducts } from "@/components/game-detail/SimilarProducts";
import type { CatalogPayload, TopUpProduct } from "@/components/game-detail/types";
import { Container } from "@/components/ui/Container";
import { createRevealVariants, createStaggerChildren } from "@/lib/animations";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type GameDetailViewProps = {
  slug: string;
};

function mapTopUpProduct(item: CatalogPayload["catalog"]["topups"][number]): TopUpProduct {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    subtitle: item.subtitle,
    genre: item.genre,
    description: item.description,
    image: item.image,
    images: item.images,
    accent: item.accent,
    glow: item.glow,
    ctaLabel: item.ctaLabel,
    purchaseHighlights: item.purchaseHighlights,
    topUpOptions: item.prices.map((option) => ({
      id: option.id,
      title: option.label,
      subtitle: option.subtitle || item.description,
      price: option.price,
      badge: option.badge,
      ctaLabel: option.badge ? "Acheter" : "Ajouter au panier",
    })),
    descriptionSections: item.descriptionSections,
    createdAt: item.createdAt,
  };
}

export function GameDetailView({ slug }: GameDetailViewProps) {
  const { isMobile } = useMotionProfile();
  const revealVariants = createRevealVariants(isMobile);
  const staggerChildren = createStaggerChildren(isMobile);
  const [product, setProduct] = useState<TopUpProduct | null>(null);
  const [topups, setTopups] = useState<TopUpProduct[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "not-found">("loading");

  useEffect(() => {
    let isMounted = true;

    fetch("/api/public/catalog", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Impossible de charger la fiche produit");
        }

        return response.json() as Promise<CatalogPayload>;
      })
      .then((payload) => {
        if (!isMounted) {
          return;
        }

        const allTopups = payload.catalog.topups.map(mapTopUpProduct);
        const currentProduct = allTopups.find((item) => item.slug === slug) ?? null;

        setTopups(allTopups);
        setProduct(currentProduct);
        setStatus(currentProduct ? "ready" : "not-found");
      })
      .catch(() => {
        if (isMounted) {
          setStatus("error");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const similarProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    const sameGenre = topups.filter((item) => item.slug !== product.slug && item.genre === product.genre);
    const fallback = topups.filter((item) => item.slug !== product.slug && item.genre !== product.genre);

    return [...sameGenre, ...fallback].slice(0, 8);
  }, [product, topups]);

  if (status === "loading") {
    return <ProductDetailSkeleton />;
  }

  if (status === "error") {
    return (
      <main className="min-h-screen bg-[#020617] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[760px] rounded-2xl border border-white/10 bg-[#0f172a] p-6 text-center">
          <h1 className="font-[family-name:var(--font-orbitron)] text-2xl font-black uppercase">Erreur de chargement</h1>
          <p className="mt-3 text-sm leading-6 text-white/62">La fiche n&apos;a pas pu etre chargee avec l&apos;API publique existante.</p>
          <Link href="/games" className="mt-5 inline-flex rounded-xl border border-sky-400/28 bg-sky-400/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-sky-200">
            Retour jeux
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#020617] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[760px] rounded-2xl border border-white/10 bg-[#0f172a] p-6 text-center">
          <h1 className="font-[family-name:var(--font-orbitron)] text-2xl font-black uppercase">Produit introuvable</h1>
          <p className="mt-3 text-sm leading-6 text-white/62">Aucune fiche TopUp ne correspond a cette URL.</p>
          <Link href="/games" className="mt-5 inline-flex rounded-xl border border-emerald-400/28 bg-emerald-400/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-emerald-200">
            Retour catalogue
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020617] pb-16 pt-5 text-gray-200 sm:pb-12 sm:pt-6">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(56,189,248,0.03),transparent_18%,transparent_72%,rgba(255,255,255,0.02))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(56,189,248,0.22),rgba(255,255,255,0.12),transparent)]" />

      <Container className="relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1320px]">
          <motion.div variants={revealVariants} initial="hidden" animate="visible" className="mb-5 flex items-center justify-between gap-3">
            <Link
              href="/games"
              aria-label="Retour a la page jeux"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0f172a] text-white/86 transition duration-200 hover:border-sky-400/30 hover:text-white hover:shadow-[0_0_18px_rgba(56,189,248,0.12)]"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </Link>

            <div className="absolute left-1/2 w-[calc(100%-6.5rem)] -translate-x-1/2 text-center md:hidden">
              <p className="truncate text-sm font-semibold tracking-[0.02em] text-white">Top up {product.title}</p>
            </div>

            <div className="ml-auto hidden text-right md:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">TopUp Game</p>
              <p className="mt-1 truncate font-[family-name:var(--font-orbitron)] text-sm font-black uppercase text-white sm:text-base">
                {product.title}
              </p>
            </div>
          </motion.div>

          <motion.div variants={revealVariants} initial="hidden" animate="visible" className="mb-4 md:hidden">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0f172a] px-4 py-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-white/10 bg-[#111c31]">
                <Image
                  src={product.images[0] ?? product.image}
                  alt={product.title}
                  fill
                  quality={100}
                  unoptimized={(product.images[0] ?? product.image).startsWith("data:")}
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex min-h-[40px] items-center justify-center rounded-md border border-white/10 bg-[#111c31] px-3 py-2 text-center">
                  <p className="text-center text-sm font-medium text-white">{product.title}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.section initial="hidden" animate="visible" variants={staggerChildren} className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_380px] lg:items-start lg:gap-5">
            <div className="space-y-4">
              <div className="hidden md:block">
                <ProductGallery title={product.title} image={product.image} images={product.images} accent={product.accent} />
              </div>
              <ProductInfo product={product} />
            </div>

            <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <AddToCartSection key={`${product.slug}-actions`} product={product} />
              <RatingStars key={`${product.slug}-rating`} productKey={product.slug} />
            </div>
          </motion.section>

          <div className="mt-5">
            <SimilarProducts products={similarProducts} />
          </div>
        </div>
      </Container>
    </main>
  );
}