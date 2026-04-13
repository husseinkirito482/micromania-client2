"use client";

import { parseCartPrice, useCart } from "@/components/cart/CartProvider";
import { Container } from "@/components/ui/Container";
import { ArrowLeft, ShoppingCart, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ShopProductDetail = {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  category: string;
  categoryId: string;
  price: string;
  badge?: string;
  stock?: number;
  ratingTotal: number;
  ratingCount: number;
};

type ShopProductDetailViewProps = {
  product: ShopProductDetail;
  similarProducts: ShopProductDetail[];
};

const ratingStorageKey = "nova.shop.product-ratings";

function renderStars(value: number) {
  return Array.from({ length: 5 }, (_, index) => {
    const filled = value >= index + 1;
    return (
      <Star
        key={`star-${index}`}
        className={`h-4 w-4 ${filled ? "fill-[#f5b942] text-[#f5b942]" : "text-slate-300"}`}
      />
    );
  });
}

export function ShopProductDetailView({ product, similarProducts }: ShopProductDetailViewProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const gallery = useMemo(() => (product.images.length > 0 ? product.images : [product.image]), [product.image, product.images]);
  const [selectedImage, setSelectedImage] = useState(gallery[0]);
  const [ratingCount, setRatingCount] = useState(product.ratingCount);
  const [ratingAverage, setRatingAverage] = useState(product.ratingCount > 0 ? product.ratingTotal / product.ratingCount : 0);
  const [submittedRating, setSubmittedRating] = useState<number | null>(null);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedImage(gallery[0]);
  }, [gallery]);

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(ratingStorageKey);

      if (!rawValue) {
        return;
      }

      const savedRatings = JSON.parse(rawValue) as Record<string, number>;
      const rating = savedRatings[product.id];

      if (rating) {
        setSubmittedRating(rating);
      }
    } catch {
      setSubmittedRating(null);
    }
  }, [product.id]);

  const isUploadedImage = selectedImage.startsWith("data:");
  const averageLabel = ratingCount > 0 ? ratingAverage.toFixed(1) : "Nouveau";
  const stockLabel = typeof product.stock === "number" && product.stock > 0 ? `${product.stock} en stock` : "Disponible";

  const ratingPanel = (
    <div className="rounded-[1.5rem] border border-[#d8e2ee] bg-[linear-gradient(180deg,#fbfdff,#f1f6fb)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Note moyenne</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1">{renderStars(Math.round(ratingAverage))}</div>
            <span className="text-sm font-semibold text-slate-950">{averageLabel}</span>
            <span className="text-sm text-slate-500">({ratingCount} avis)</span>
          </div>
        </div>
        {submittedRating ? (
          <span className="rounded-full border border-[#d5dff0] bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
            Votre note: {submittedRating}/5
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: 5 }, (_, index) => {
          const rating = index + 1;
          const isSelected = submittedRating ? rating <= submittedRating : false;

          return (
            <button
              key={rating}
              type="button"
              onClick={() => submitRating(rating)}
              disabled={Boolean(submittedRating) || isRatingSubmitting}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition duration-200 ${
                isSelected
                  ? "border-[#f6c25b] bg-[#fff6db] text-[#8a5a00]"
                  : "border-[#d9e2ee] bg-white text-slate-600 hover:border-[#c0cde0] hover:text-slate-950"
              } disabled:cursor-not-allowed disabled:opacity-70`}
            >
              <Star className={`h-4 w-4 ${isSelected ? "fill-[#f5b942] text-[#f5b942]" : "text-slate-400"}`} />
              {rating}
            </button>
          );
        })}
      </div>

      {ratingError ? <p className="mt-3 text-sm text-rose-600">{ratingError}</p> : null}
    </div>
  );

  const addCurrentProduct = (sourceRect?: DOMRect | null) => {
    addItem(
      {
        id: product.id,
        name: product.title,
        price: parseCartPrice(product.price),
        image: product.image,
        category: product.category,
      },
      sourceRect,
    );
  };

  const submitRating = async (rating: number) => {
    if (submittedRating || isRatingSubmitting) {
      return;
    }

    setIsRatingSubmitting(true);
    setRatingError(null);

    try {
      const response = await fetch(`/api/public/catalog/shop/${product.id}/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({ error: "Impossible d'envoyer la note" }))) as { error?: string };
        throw new Error(payload.error || "Impossible d'envoyer la note");
      }

      const payload = (await response.json()) as { ratingAverage: number; ratingCount: number };
      setSubmittedRating(rating);
      setRatingAverage(payload.ratingAverage);
      setRatingCount(payload.ratingCount);

      try {
        const rawValue = window.localStorage.getItem(ratingStorageKey);
        const savedRatings = rawValue ? (JSON.parse(rawValue) as Record<string, number>) : {};
        savedRatings[product.id] = rating;
        window.localStorage.setItem(ratingStorageKey, JSON.stringify(savedRatings));
      } catch {
        // Keep the UI updated even if local persistence is unavailable.
      }
    } catch (error) {
      setRatingError(error instanceof Error ? error.message : "Impossible d'envoyer la note");
    } finally {
      setIsRatingSubmitting(false);
    }
  };

  const similarCards = useMemo(() => similarProducts.slice(0, 6), [similarProducts]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#edf3fa_0%,#f6f8fc_28%,#e9eff8_100%)] pb-12 text-slate-950 sm:pb-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.9),transparent_18%),radial-gradient(circle_at_86%_12%,rgba(96,165,250,0.14),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.08),transparent_30%)]" />
      <Container className="relative px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
        <div className="mx-auto max-w-[1360px]">
          <div className="relative flex items-center justify-start gap-3 sm:justify-between">
            <Link
              href="/shop"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d5dfec] bg-[linear-gradient(180deg,#ffffff,#eef3fa)] text-slate-700 shadow-[0_10px_24px_rgba(130,149,181,0.14)] transition duration-200 hover:-translate-y-0.5 hover:text-slate-950"
              aria-label="Retour a la boutique"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="absolute left-1/2 w-[calc(100%-5.5rem)] -translate-x-1/2 text-center sm:static sm:w-auto sm:translate-x-0 sm:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Produit</p>
              <h1 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-slate-950 sm:text-2xl">{product.title}</h1>
            </div>
          </div>

          <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:gap-8">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[2rem] border border-[#d8e2ee] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(239,245,251,0.96))] p-3 shadow-[0_24px_60px_rgba(130,149,181,0.14)] sm:p-4">
                <div className="relative overflow-hidden rounded-[1.5rem] border border-[#e1e9f3] bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.88),rgba(236,242,249,0.95)_58%,rgba(230,237,246,0.98))]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(255,255,255,0.88),transparent_38%)]" />
                  <div className="relative aspect-[1/1.02] sm:aspect-[1.06/1]">
                    <Image
                      src={selectedImage}
                      alt={product.title}
                      fill
                      priority
                      quality={100}
                      unoptimized={isUploadedImage}
                      sizes="(max-width: 768px) 92vw, (max-width: 1280px) 56vw, 760px"
                      className="object-contain p-5 sm:p-8"
                    />
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto pb-1">
                  <div className="flex gap-3">
                    {gallery.map((image, index) => {
                      const isActive = selectedImage === image;

                      return (
                        <button
                          key={`${image.slice(0, 24)}-${index}`}
                          type="button"
                          onClick={() => setSelectedImage(image)}
                          className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-[1.1rem] border transition duration-200 sm:h-24 sm:w-24 ${
                            isActive
                              ? "border-[#5a72ec] bg-[#eef3ff] shadow-[0_14px_28px_rgba(90,114,236,0.18)]"
                              : "border-[#dbe4ef] bg-[linear-gradient(180deg,#ffffff,#f1f5fa)] hover:border-[#b8c7de]"
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${product.title} vue ${index + 1}`}
                            fill
                            quality={100}
                            unoptimized={image.startsWith("data:")}
                            sizes="96px"
                            className="object-contain p-2"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <section className="rounded-[2rem] border border-[#d9e3ef] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,246,252,0.96))] p-5 shadow-[0_20px_44px_rgba(130,149,181,0.12)] sm:p-6">
                <div className="flex items-center gap-2 text-slate-500">
                  <Sparkles className="h-4 w-4 text-[#5a72ec]" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Description</p>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-[15px]">{product.description}</p>
              </section>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <section className="rounded-[2rem] border border-[#d8e2ee] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(238,244,251,0.98))] p-5 shadow-[0_24px_56px_rgba(130,149,181,0.14)] sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#d8e1ee] bg-[#f5f8fd] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                    {product.category}
                  </span>
                  {product.badge ? (
                    <span className="rounded-full border border-[#d7def8] bg-[#eef2ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5167dc]">
                      {product.badge}
                    </span>
                  ) : null}
                  <span className="rounded-full border border-[#dce5ef] bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {stockLabel}
                  </span>
                </div>

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-[2.4rem]">{product.title}</h2>

                <div className="mt-4 flex items-center gap-3">
                  <p className="text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-[2.5rem]">{product.price}</p>
                  <div className="rounded-full border border-[#d8e1ee] bg-white/72 px-3 py-1.5 text-xs font-medium text-slate-500">
                    Livraison digitale rapide
                  </div>
                </div>

                <div className="hidden sm:block sm:mt-5">{ratingPanel}</div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={(event) => {
                      addCurrentProduct(event.currentTarget.getBoundingClientRect());
                      router.push("/cart");
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(180deg,#4d66d8,#5c74ef)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(92,116,239,0.24)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_34px_rgba(92,116,239,0.28)]"
                  >
                    Acheter maintenant
                  </button>
                  <button
                    type="button"
                    onClick={(event) => addCurrentProduct(event.currentTarget.getBoundingClientRect())}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9e2ee] bg-[linear-gradient(180deg,#ffffff,#f3f7fc)] px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-[0_12px_24px_rgba(130,149,181,0.12)] transition duration-200 hover:-translate-y-0.5 hover:border-[#bccbe1]"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Ajouter au panier
                  </button>
                </div>
              </section>

              <section className="sm:hidden">{ratingPanel}</section>

              <section className="hidden rounded-[2rem] border border-[#d9e2ee] bg-[linear-gradient(180deg,rgba(251,253,255,0.98),rgba(239,244,251,0.98))] p-5 shadow-[0_20px_44px_rgba(130,149,181,0.12)] sm:block sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pourquoi ce produit</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.35rem] border border-[#dbe4ef] bg-white/70 px-4 py-4 text-sm text-slate-600">
                    Galerie multi-images nette et optimisee pour mobile.
                  </div>
                  <div className="rounded-[1.35rem] border border-[#dbe4ef] bg-white/70 px-4 py-4 text-sm text-slate-600">
                    Mise en page claire avec information produit et actions immediates.
                  </div>
                  <div className="rounded-[1.35rem] border border-[#dbe4ef] bg-white/70 px-4 py-4 text-sm text-slate-600">
                    Produits similaires automatiques bases sur la meme categorie.
                  </div>
                </div>
              </section>
            </div>
          </section>

          <section className="mt-6 sm:mt-8 sm:rounded-[2rem] sm:border sm:border-[#d9e2ee] sm:bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,245,252,0.98))] sm:p-6 sm:shadow-[0_24px_52px_rgba(130,149,181,0.12)]">
            <div className="hidden items-center justify-between gap-3 sm:flex">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Meme categorie</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Articles similaires</h3>
              </div>
              <Link href="/shop" className="text-sm font-semibold text-[#5167dc] transition hover:text-[#4053bb]">
                Retour boutique
              </Link>
            </div>

            <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-5 sm:overflow-visible sm:pb-0">
              <div className="flex gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {similarCards.map((item) => {
                  const itemAverage = item.ratingCount > 0 ? item.ratingTotal / item.ratingCount : 0;

                  return (
                    <motion.article
                      key={item.id}
                      whileHover={{ y: -4, boxShadow: "0 20px 34px rgba(130,149,181,0.16)" }}
                      transition={{ duration: 0.18 }}
                      className="min-w-[240px] overflow-hidden rounded-[1.25rem] bg-transparent shadow-none sm:min-w-0 sm:rounded-[1.5rem] sm:border sm:border-[#dbe4ef] sm:bg-[linear-gradient(180deg,#ffffff,#f2f6fb)] sm:shadow-[0_14px_28px_rgba(130,149,181,0.12)]"
                    >
                      <Link href={`/shop/${item.id}`} className="block">
                        <div className="relative aspect-[1/0.92] rounded-[1.25rem] bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.88),rgba(236,242,249,0.96)_60%)] sm:rounded-none sm:border-b sm:border-[#e3ebf4]">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            quality={100}
                            unoptimized={item.image.startsWith("data:")}
                            sizes="(max-width: 640px) 250px, (max-width: 1280px) 33vw, 25vw"
                            className="object-contain p-4"
                          />
                        </div>
                      </Link>

                      <div className="space-y-3 px-1 pb-1 pt-3 sm:p-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{item.category}</span>
                          <span className="rounded-full border border-[#d8e1ee] bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                            {item.price}
                          </span>
                        </div>
                        <Link href={`/shop/${item.id}`} className="block">
                          <h4 className="line-clamp-2 text-lg font-semibold tracking-[-0.02em] text-slate-950">{item.title}</h4>
                        </Link>
                        <p className="line-clamp-2 text-sm leading-6 text-slate-500">{item.description}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">{renderStars(Math.round(itemAverage))}</div>
                          <span className="text-xs text-slate-500">{item.ratingCount > 0 ? itemAverage.toFixed(1) : "Nouveau"}</span>
                        </div>
                        <Link
                          href={`/shop/${item.id}`}
                          className="hidden w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#4d66d8,#556ef0)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(85,110,240,0.22)] transition duration-200 hover:bg-[linear-gradient(180deg,#5872e7,#6079fb)] sm:inline-flex"
                        >
                          Voir
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}