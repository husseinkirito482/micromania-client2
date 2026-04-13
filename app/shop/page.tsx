"use client";

import { formatCartPrice, useCart } from "@/components/cart/CartProvider";
import { Container } from "@/components/ui/Container";
import { snappyEase } from "@/lib/animations";
import { LayoutGrid, Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CatalogShopProduct = {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  category: string;
  price: string;
  badge?: string;
  ratingTotal: number;
  ratingCount: number;
};

export default function ShopPage() {
  const {
    items: shopCartItems,
    removeItem: removeShopItem,
    totalAmount: shopTotalAmount,
    totalQuantity: shopTotalQuantity,
    updateItemQuantity: updateShopItemQuantity,
  } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("Toutes");
  const [searchValue, setSearchValue] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isShopCartOpen, setIsShopCartOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<CatalogShopProduct[]>([]);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/public/catalog", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { catalog: { shop: CatalogShopProduct[] } }) => {
        if (isMounted) {
          setCatalogProducts(payload.catalog.shop);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  const shopCategories = useMemo(() => ["Toutes", ...Array.from(new Set(catalogProducts.map((product) => product.category)))], [catalogProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();

    let products = selectedCategory === "Toutes"
      ? catalogProducts
      : catalogProducts.filter((product) => product.category === selectedCategory);

    if (normalizedQuery) {
      products = products.filter((product) =>
        `${product.title} ${product.description} ${product.category}`.toLowerCase().includes(normalizedQuery),
      );
    }

    return products;
  }, [catalogProducts, searchValue, selectedCategory]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef3f9_0%,#f4f7fb_22%,#e9eff8_100%)] pb-12 text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.6),transparent_22%),radial-gradient(circle_at_82%_10%,rgba(96,165,250,0.1),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent_30%)]" />
      <Container className="px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
        <section className="mx-auto max-w-[1360px]">
          <div className="fixed inset-x-0 top-0 z-40">
            <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,rgba(238,243,249,0.98),rgba(238,243,249,0.94),rgba(238,243,249,0.74),rgba(238,243,249,0))] backdrop-blur-xl" />
            <div className="relative mx-auto max-w-[1360px] px-4 pt-3 sm:px-6 sm:pt-4 lg:px-10">
              <header className="rounded-[1.6rem] border border-[#d8e1ee] bg-[linear-gradient(180deg,rgba(250,252,255,0.96),rgba(240,245,251,0.94))] px-4 py-3 shadow-[0_18px_42px_rgba(112,134,168,0.12),0_2px_0_rgba(255,255,255,0.62)_inset] backdrop-blur-md sm:rounded-[2rem] sm:px-5 sm:py-4 lg:px-6">
                <div className="sm:hidden">
                  <div className="flex items-center justify-between gap-3">
                    <Link href="/" className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#263241,#18202d)] text-xs font-black tracking-[0.18em] text-[#f8fafc] shadow-[0_12px_24px_rgba(30,41,59,0.18)]">
                        NS
                      </div>
                      <div className="min-w-0">
                        <h1 className="truncate text-base font-semibold tracking-[-0.01em] text-slate-900">SILVESTRE SHOP</h1>
                      </div>
                    </Link>

                    <div className="relative flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCategoryOpen((currentValue) => !currentValue);
                          setIsShopCartOpen(false);
                        }}
                        aria-label="Ouvrir les categories"
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d6deea] bg-[linear-gradient(180deg,#fcfdff,#eef3fa)] text-slate-700 shadow-[0_10px_22px_rgba(130,149,181,0.12)] transition duration-200 active:scale-95"
                      >
                        <LayoutGrid className="h-5 w-5 text-slate-600" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsShopCartOpen((currentValue) => !currentValue);
                          setIsCategoryOpen(false);
                        }}
                        aria-label="Ouvrir le panier boutique"
                        className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d6deea] bg-[linear-gradient(180deg,#fcfdff,#eef3fa)] text-slate-700 shadow-[0_10px_22px_rgba(130,149,181,0.12)] transition duration-200 active:scale-95"
                      >
                        <ShoppingCart className="h-5 w-5 text-slate-700" />
                        {shopTotalQuantity > 0 ? (
                          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#4c63d8] px-1 text-[10px] font-bold text-white shadow-[0_10px_20px_rgba(76,99,216,0.24)]">
                            {shopTotalQuantity > 99 ? "99+" : shopTotalQuantity}
                          </span>
                        ) : null}
                      </button>
                    </div>
                  </div>

                  <label className="relative mt-3 block w-full">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition duration-150">
                      <Search className="h-4.5 w-4.5" />
                    </span>
                    <input
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                      type="search"
                      placeholder="Rechercher un produit"
                      className="w-full rounded-full border border-[#d5deea] bg-[linear-gradient(180deg,#fcfdff,#f1f5fb)] py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition duration-150 placeholder:text-slate-400 focus:border-[#9fb4d7] focus:bg-[#ffffff] focus:shadow-[0_14px_28px_rgba(130,149,181,0.14)]"
                    />
                  </label>

                  {isCategoryOpen ? (
                    <div className="mt-3 rounded-[1.5rem] border border-[#d8e1ee] bg-[linear-gradient(180deg,#fbfcff,#eef3f9)] p-2 shadow-[0_20px_40px_rgba(130,149,181,0.14)]">
                      {shopCategories.map((category) => {
                        const isActive = selectedCategory === category;

                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsCategoryOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition duration-150 ${
                              isActive ? "bg-[linear-gradient(180deg,#4a63d3,#5a72ec)] text-white shadow-[0_10px_20px_rgba(90,114,236,0.22)]" : "text-slate-700 hover:bg-[#eef3fa]"
                            }`}
                          >
                            <span>{category}</span>
                            {isActive ? <span className="text-xs uppercase tracking-[0.18em] text-white/68">Actif</span> : null}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {isShopCartOpen ? (
                    <div className="mt-3 rounded-[1.5rem] border border-[#d8e1ee] bg-[linear-gradient(180deg,#fbfcff,#eef3f9)] p-3 shadow-[0_20px_40px_rgba(130,149,181,0.14)]">
                      <div className="flex items-center justify-between gap-3 border-b border-[#e1e8f2] pb-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Panier</p>
                          <h3 className="mt-1 text-base font-semibold text-slate-950">Mon panier</h3>
                        </div>
                        <span className="rounded-full border border-[#d8e1ee] bg-[#f7faff] px-2.5 py-1 text-xs font-medium text-slate-600">
                          {shopTotalQuantity} article{shopTotalQuantity > 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="mt-3 space-y-3">
                        {shopCartItems.length > 0 ? (
                          shopCartItems.map((item) => (
                            <article
                              key={item.id}
                              className="rounded-[1.25rem] border border-[#dbe4ef] bg-[linear-gradient(180deg,#ffffff,#f3f7fc)] p-2.5 shadow-[0_10px_20px_rgba(130,149,181,0.12)]"
                            >
                              <div className="flex gap-3">
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[0.9rem] bg-[linear-gradient(180deg,#f7faff,#edf3fa)]">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    sizes="56px"
                                    className="object-contain p-2"
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-950">{item.name}</p>
                                      <p className="mt-1 text-xs text-slate-500">{item.category}</p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeShopItem(item.id)}
                                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition duration-150 hover:bg-[#eef3fa] hover:text-slate-700"
                                      aria-label={`Supprimer ${item.name}`}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>

                                  <div className="mt-3 flex items-center justify-between gap-3">
                                    <div className="inline-flex items-center rounded-full border border-[#dbe4ef] bg-[#f2f6fb] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.62)]">
                                      <button
                                        type="button"
                                        onClick={() => updateShopItemQuantity(item.id, "decrement")}
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition duration-150 hover:bg-[#ffffff] hover:text-slate-950"
                                        aria-label={`Diminuer ${item.name}`}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </button>
                                      <span className="min-w-8 text-center text-sm font-semibold text-slate-950">{item.quantity}</span>
                                      <button
                                        type="button"
                                        onClick={() => updateShopItemQuantity(item.id, "increment")}
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition duration-150 hover:bg-[#ffffff] hover:text-slate-950"
                                        aria-label={`Augmenter ${item.name}`}
                                      >
                                        <Plus className="h-4 w-4" />
                                      </button>
                                    </div>

                                    <p className="text-sm font-semibold text-slate-950">{formatCartPrice(item.price * item.quantity)}</p>
                                  </div>
                                </div>
                              </div>
                            </article>
                          ))
                        ) : (
                          <div className="rounded-[1.25rem] border border-dashed border-[#d9e2ee] bg-[linear-gradient(180deg,#fbfcff,#f1f5fa)] px-4 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                            <p className="text-sm font-medium text-slate-950">Panier vide</p>
                              <p className="mt-2 text-xs leading-5 text-slate-500">
                              Ajoute un produit depuis sa fiche detail pour le retrouver ici.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 rounded-[1.25rem] border border-[#d9e2ee] bg-[linear-gradient(180deg,#ffffff,#f2f6fb)] p-4 shadow-[0_12px_24px_rgba(130,149,181,0.12)]">
                        <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                          <span>Articles</span>
                          <span>{shopTotalQuantity}</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3 text-base font-semibold text-slate-950">
                          <span>Total</span>
                          <span>{formatCartPrice(shopTotalAmount)}</span>
                        </div>
                        <button
                          type="button"
                          className="mt-4 flex w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#4d66d8,#556ef0)] px-4 py-3 text-sm font-medium text-white shadow-[0_12px_24px_rgba(85,110,240,0.24)] transition duration-200 hover:bg-[linear-gradient(180deg,#5872e7,#6079fb)] disabled:opacity-45"
                          disabled={shopCartItems.length === 0}
                        >
                          Finaliser la commande
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="hidden sm:block">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Link href="/" className="flex items-start gap-2 sm:gap-3">
                        <div className="flex h-9 w-9 -translate-y-1 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#263241,#18202d)] text-xs font-black tracking-[0.18em] text-[#f8fafc] shadow-[0_12px_24px_rgba(30,41,59,0.18)] sm:h-11 sm:w-11 sm:-translate-y-2 sm:rounded-2xl sm:text-sm">
                          NS
                        </div>
                        <div>
                          <h1 className="text-base font-semibold tracking-[-0.01em] text-slate-900 sm:text-xl">SILVESTRE SHOP</h1>
                        </div>
                      </Link>
                    </div>

                    <div className="w-full lg:w-full lg:max-w-sm lg:flex-none">
                      <label className="relative block w-full sm:max-w-sm">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition duration-150">
                          <Search className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                        </span>
                        <input
                          value={searchValue}
                          onChange={(event) => setSearchValue(event.target.value)}
                          type="search"
                          placeholder="Rechercher un produit"
                          className="w-full rounded-full border border-[#d5deea] bg-[linear-gradient(180deg,#fcfdff,#f1f5fb)] py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition duration-150 placeholder:text-slate-400 focus:border-[#9fb4d7] focus:bg-[#ffffff] focus:shadow-[0_14px_28px_rgba(130,149,181,0.14)] sm:max-w-sm sm:py-3.5 sm:pl-12"
                        />
                      </label>
                    </div>

                    <div className="relative flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => setIsCategoryOpen((currentValue) => !currentValue)}
                        aria-label="Ouvrir les categories"
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d6deea] bg-[linear-gradient(180deg,#fcfdff,#eef3fa)] text-slate-700 shadow-[0_10px_22px_rgba(130,149,181,0.12)] transition duration-200 hover:-translate-y-0.5 hover:border-[#aebfda] hover:text-slate-950 hover:shadow-[0_16px_30px_rgba(130,149,181,0.16)] active:scale-95 sm:h-12 sm:w-12"
                      >
                        <LayoutGrid className="h-7 w-7 text-slate-600 transition duration-200 hover:text-slate-900 sm:h-6 sm:w-6" />
                      </button>

                      {isCategoryOpen ? (
                        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 min-w-60 rounded-[1.5rem] border border-[#d8e1ee] bg-[linear-gradient(180deg,#fbfcff,#eef3f9)] p-2 shadow-[0_20px_40px_rgba(130,149,181,0.14)]">
                          {shopCategories.map((category) => {
                            const isActive = selectedCategory === category;

                            return (
                              <button
                                key={category}
                                type="button"
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setIsCategoryOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition duration-150 ${
                                  isActive ? "bg-[linear-gradient(180deg,#4a63d3,#5a72ec)] text-white shadow-[0_10px_20px_rgba(90,114,236,0.22)]" : "text-slate-700 hover:bg-[#eef3fa]"
                                }`}
                              >
                                <span>{category}</span>
                                {isActive ? <span className="text-xs uppercase tracking-[0.18em] text-white/68">Actif</span> : null}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </header>

              <div className="pointer-events-none relative mt-3 h-[2px] overflow-visible">
                <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(148,163,184,0.12),rgba(100,116,139,0.38),rgba(148,163,184,0.12),transparent)]" />
                <div className="absolute left-1/2 top-1/2 h-3 w-40 -translate-x-1/2 -translate-y-1/2 bg-blue-300/12 blur-lg" />
              </div>
            </div>
          </div>

          <section className="grid gap-4 pt-[8.75rem] sm:pt-[8rem] xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-8 xl:items-start">
            <div>
              <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
                {filteredProducts.map((product) => (
                  <motion.article
                    key={product.id}
                    whileHover={{ y: -5, boxShadow: "0 24px 36px rgba(100,116,139,0.16)" }}
                    transition={{ duration: 0.18, ease: snappyEase }}
                    className="overflow-hidden rounded-[1.2rem] border border-[#dbe4ef] bg-[linear-gradient(180deg,#fcfdff,#f2f6fb)] shadow-[0_14px_28px_rgba(130,149,181,0.12)] transition duration-200 sm:rounded-[1.6rem]"
                  >
                    <Link href={`/shop/${product.id}`} className="block">
                      <div className="relative aspect-[0.92] overflow-hidden border-b border-[#e3ebf4] bg-[linear-gradient(180deg,#f4f8fd,#eaf0f8)]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.7),transparent_48%)]" />
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          className="object-contain p-3 transition duration-200 hover:scale-[1.03] sm:p-5"
                        />
                      </div>
                    </Link>

                    <div className="space-y-3 p-2 sm:space-y-4 sm:p-5">
                      <Link href={`/shop/${product.id}`} className="block sm:hidden">
                        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-950">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="sm:hidden">
                        <p className="mt-1 text-sm font-semibold text-slate-950">{product.price}</p>
                      </div>

                      <div className="hidden sm:block sm:space-y-2">
                        <div className="flex items-center justify-between gap-2 sm:gap-3">
                          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{product.category}</p>
                          {product.badge ? (
                            <span className="rounded-full border border-[#d9e2ee] bg-[#f3f7fc] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                              {product.badge}
                            </span>
                          ) : null}
                        </div>

                        <Link href={`/shop/${product.id}`} className="block">
                          <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-950 sm:text-lg sm:leading-6">
                            {product.title}
                          </h3>
                        </Link>
                        <p className="line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">{product.description}</p>
                      </div>

                      <div className="hidden sm:flex sm:items-end sm:justify-between sm:gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Prix</p>
                          <p className="mt-1 text-base font-semibold text-slate-950 sm:text-xl">{product.price}</p>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.05, boxShadow: "0 0 22px rgba(148,163,184,0.12)" }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.16, ease: snappyEase }}
                      >
                        <Link
                          href={`/shop/${product.id}`}
                          className="flex w-full items-center justify-center rounded-md border border-[#d8e1ee] bg-[linear-gradient(180deg,#ffffff,#f3f7fc)] px-3 py-2 text-sm font-medium text-slate-800 transition duration-200 hover:shadow-[0_0_18px_rgba(130,149,181,0.14)] sm:rounded-full sm:bg-[linear-gradient(180deg,#4d66d8,#556ef0)] sm:px-4 sm:py-3 sm:text-sm sm:text-white sm:hover:bg-[linear-gradient(180deg,#5872e7,#6079fb)] sm:hover:shadow-none sm:border-transparent"
                        >
                          Voir
                        </Link>
                      </motion.div>
                    </div>
                  </motion.article>
                ))}
              </section>
            </div>

            <aside className="hidden rounded-[1.6rem] border border-[#d9e2ee] bg-[linear-gradient(180deg,#fbfcff,#eef3f9)] p-4 shadow-[0_20px_40px_rgba(130,149,181,0.12)] xl:sticky xl:top-28 xl:rounded-[2rem] xl:block xl:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">Panier</p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-950 sm:text-2xl">Mon panier</h3>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9e2ee] bg-[#f7faff] text-slate-700 shadow-[0_10px_20px_rgba(130,149,181,0.12)] sm:h-11 sm:w-11">
                  <ShoppingCart className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {shopCartItems.length > 0 ? (
                  shopCartItems.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-[1.25rem] border border-[#dbe4ef] bg-[linear-gradient(180deg,#ffffff,#f3f7fc)] p-2.5 shadow-[0_10px_20px_rgba(130,149,181,0.12)] transition duration-150 sm:rounded-[1.5rem] sm:p-3"
                    >
                      <div className="flex gap-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[0.9rem] bg-[linear-gradient(180deg,#f7faff,#edf3fa)] sm:h-20 sm:w-20 sm:rounded-[1rem]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-contain p-2"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-950">{item.name}</p>
                              <p className="mt-1 text-xs text-slate-500">{item.category ?? "Produit"}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeShopItem(item.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition duration-150 hover:bg-[#eef3fa] hover:text-slate-700"
                              aria-label={`Supprimer ${item.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="inline-flex items-center rounded-full border border-[#dbe4ef] bg-[#f2f6fb] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.62)]">
                              <button
                                type="button"
                                onClick={() => updateShopItemQuantity(item.id, "decrement")}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition duration-150 hover:bg-[#ffffff] hover:text-slate-950"
                                aria-label={`Diminuer ${item.name}`}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-8 text-center text-sm font-semibold text-slate-950">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateShopItemQuantity(item.id, "increment")}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition duration-150 hover:bg-[#ffffff] hover:text-slate-950"
                                aria-label={`Augmenter ${item.name}`}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <p className="text-sm font-semibold text-slate-950">{formatCartPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[1.5rem] border border-dashed border-[#d9e2ee] bg-[linear-gradient(180deg,#fbfcff,#f1f5fa)] px-4 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                    <p className="text-base font-medium text-slate-950">Panier vide</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Ajoute un produit depuis une fiche detail pour le voir ici et finaliser rapidement.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-[#d9e2ee] bg-[linear-gradient(180deg,#ffffff,#f2f6fb)] p-4 shadow-[0_12px_24px_rgba(130,149,181,0.12)]">
                <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                  <span>Articles</span>
                  <span>{shopTotalQuantity}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-lg font-semibold text-slate-950">
                  <span>Total</span>
                  <span>{formatCartPrice(shopTotalAmount)}</span>
                </div>
                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#4d66d8,#556ef0)] px-4 py-3 text-sm font-medium text-white shadow-[0_12px_24px_rgba(85,110,240,0.24)] transition duration-200 hover:bg-[linear-gradient(180deg,#5872e7,#6079fb)] disabled:opacity-45"
                  disabled={shopCartItems.length === 0}
                >
                  Finaliser la commande
                </button>
              </div>
            </aside>
          </section>

          {filteredProducts.length === 0 ? (
            <section className="mt-8 rounded-[1.8rem] border border-dashed border-[#d9e2ee] bg-[linear-gradient(180deg,#fbfcff,#f1f5fa)] px-6 py-12 text-center shadow-[0_14px_28px_rgba(130,149,181,0.1)]">
              <h3 className="text-xl font-semibold text-slate-950">Aucun produit trouve</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Essaie une autre recherche ou change de categorie pour afficher plus de produits.
              </p>
            </section>
          ) : null}
        </section>
      </Container>
    </main>
  );
}