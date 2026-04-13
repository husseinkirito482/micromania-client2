"use client";

import { Button } from "@/components/ui/Button";
import type {
  CatalogData,
  CatalogGiftCardItem,
  CatalogPriceOption,
  CatalogProductType,
  CatalogShopItem,
  CatalogTopUpItem,
  GlobalNotificationItem,
  ShopCategoryItem,
} from "@/lib/catalog-store";
import {
  Bell,
  Boxes,
  CreditCard,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Pencil,
  Plus,
  Search,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useDeferredValue, useEffect, useMemo, useState, useTransition } from "react";

type DashboardStats = {
  total: number;
  topups: number;
  giftCards: number;
  shop: number;
  categories: number;
  notifications: number;
  latest: Array<CatalogTopUpItem | CatalogGiftCardItem | CatalogShopItem>;
};

type CategoryListItem = ShopCategoryItem & {
  productCount: number;
};

type NotificationsPayload = {
  items: GlobalNotificationItem[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

type AdminResponse = {
  catalog: CatalogData;
  stats: DashboardStats;
  categories: CategoryListItem[];
  notifications: NotificationsPayload;
};

type ViewKey = "dashboard" | "products" | "editor" | "categories";

type FormState = {
  id?: string;
  type: CatalogProductType;
  title: string;
  description: string;
  images: string[];
  subtitle: string;
  genre: string;
  slug: string;
  ctaLabel: string;
  purchaseHighlights: string;
  prices: CatalogPriceOption[];
  brand: string;
  amount: string;
  badge: string;
  categoryId: string;
  price: string;
  stock: string;
};

type CategoryFormState = {
  id?: string;
  name: string;
  image: string;
};

type CommunicationFormState = {
  title: string;
  message: string;
};

const emptyForm: FormState = {
  type: "topup",
  title: "",
  description: "",
  images: [],
  subtitle: "",
  genre: "",
  slug: "",
  ctaLabel: "",
  purchaseHighlights: "",
  prices: [{ id: "price-0", label: "", subtitle: "", price: "", badge: "" }],
  brand: "",
  amount: "",
  badge: "",
  categoryId: "",
  price: "",
  stock: "",
};

const emptyCategoryForm: CategoryFormState = {
  name: "",
  image: "",
};

const emptyCommunicationForm: CommunicationFormState = {
  title: "",
  message: "",
};

function getProductHref(product: CatalogTopUpItem | CatalogGiftCardItem | CatalogShopItem) {
  if (product.type === "topup") {
    return `/games/${product.slug}`;
  }

  if (product.type === "gift-card") {
    return `/gift-cards?card=${product.id}`;
  }

  return `/shop/${product.id}`;
}

function flattenCatalog(catalog: CatalogData) {
  return [...catalog.topups, ...catalog.giftCards, ...catalog.shop].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

async function filesToDataUrls(files: FileList) {
  const values = await Promise.all(
    Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error(`Impossible de lire ${file.name}`));
          reader.readAsDataURL(file);
        }),
    ),
  );

  return values;
}

export function AdminDashboard() {
  const router = useRouter();
  const [view, setView] = useState<ViewKey>("dashboard");
  const [catalog, setCatalog] = useState<CatalogData>({ topups: [], giftCards: [], shop: [], categories: [], notifications: [] });
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    topups: 0,
    giftCards: 0,
    shop: 0,
    categories: 0,
    notifications: 0,
    latest: [],
  });
  const [categories, setCategories] = useState<CategoryListItem[]>([]);
  const [notifications, setNotifications] = useState<GlobalNotificationItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | CatalogProductType>("all");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(emptyCategoryForm);
  const [communicationForm, setCommunicationForm] = useState<CommunicationFormState>(emptyCommunicationForm);
  const [notice, setNotice] = useState<string | null>(null);
  const [isCommunicationOpen, setIsCommunicationOpen] = useState(false);
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
  const [isCommunicationSubmitting, setIsCommunicationSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const loadCatalog = useCallback(async () => {
    const response = await fetch("/api/admin/catalog", { cache: "no-store" });

    if (response.status === 401) {
      router.replace("/login?admin=1");
      return;
    }

    if (!response.ok) {
      throw new Error("Impossible de charger le catalogue");
    }

    const payload = (await response.json()) as AdminResponse;
    setCatalog(payload.catalog);
    setStats(payload.stats);
    setCategories(payload.categories);
    setNotifications(payload.notifications.items);
  }, [router]);

  useEffect(() => {
    startTransition(() => {
      loadCatalog().catch((error: Error) => setNotice(error.message));
    });
  }, [loadCatalog]);

  const allProducts = useMemo(() => flattenCatalog(catalog), [catalog]);

  const filteredProducts = useMemo(() => {
    const matchesType = filterType === "all" ? allProducts : allProducts.filter((product) => product.type === filterType);

    if (!deferredSearch) {
      return matchesType;
    }

    return matchesType.filter((product) => {
      const optionalCategory = product.type === "shop" ? product.category : "";
      const haystack = `${product.title} ${product.description} ${product.type} ${optionalCategory}`.toLowerCase();
      return haystack.includes(deferredSearch);
    });
  }, [allProducts, deferredSearch, filterType]);

  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const editProduct = (product: CatalogTopUpItem | CatalogGiftCardItem | CatalogShopItem) => {
    if (product.type === "topup") {
      setForm({
        id: product.id,
        type: "topup",
        title: product.title,
        description: product.description,
        images: product.images,
        subtitle: product.subtitle,
        genre: product.genre,
        slug: product.slug,
        ctaLabel: product.ctaLabel,
        purchaseHighlights: product.purchaseHighlights.join("\n"),
        prices: product.prices,
        brand: "",
        amount: "",
        badge: "",
        categoryId: "",
        price: "",
        stock: "",
      });
    } else if (product.type === "gift-card") {
      setForm({
        ...emptyForm,
        id: product.id,
        type: "gift-card",
        title: product.title,
        description: product.description,
        images: product.images,
        brand: product.brand,
        amount: product.amount,
        badge: product.badge,
      });
    } else {
      setForm({
        ...emptyForm,
        id: product.id,
        type: "shop",
        title: product.title,
        description: product.description,
        images: product.images,
        categoryId: product.categoryId,
        price: product.price,
        badge: product.badge ?? "",
        stock: String(product.stock ?? ""),
      });
    }

    setView("editor");
  };

  const resetForm = () => {
    setForm(emptyForm);
  };

  const submitForm = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      throw new Error("Titre et description requis");
    }

    if (form.type === "shop") {
      if (categories.length === 0) {
        throw new Error("Creez au moins une categorie avant d'ajouter un produit boutique");
      }

      if (!form.categoryId) {
        throw new Error("La categorie du produit est obligatoire");
      }
    }

    const stockValue = form.stock.trim();
    const parsedStock = stockValue ? Number(form.stock) : undefined;

    if (stockValue && Number.isNaN(parsedStock)) {
      throw new Error("Stock invalide");
    }

    const payload = {
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim(),
      images: form.images,
      subtitle: form.subtitle.trim(),
      genre: form.genre.trim(),
      slug: form.slug.trim(),
      ctaLabel: form.ctaLabel.trim(),
      purchaseHighlights: form.purchaseHighlights
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      prices: form.prices.filter((price) => price.label.trim() && price.price.trim()),
      brand: form.brand.trim(),
      amount: form.amount.trim(),
      badge: form.badge.trim(),
      categoryId: form.categoryId,
      price: form.price.trim(),
      stock: parsedStock,
    };

    const endpoint = form.id ? `/api/admin/products/${form.id}` : "/api/admin/products";
    const method = form.id ? "PATCH" : "POST";
    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorPayload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(errorPayload?.error || "Impossible d'enregistrer le produit");
    }

    await loadCatalog();
    setNotice(form.id ? "Produit mis a jour" : "Produit ajoute");
    resetForm();
    setView("products");
  };

  const removeProduct = async (id: string) => {
    if (!window.confirm("Supprimer ce produit ?")) {
      return;
    }

    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Suppression impossible");
    }

    await loadCatalog();
    setNotice("Produit supprime");
  };

  const submitCategory = async () => {
    if (!categoryForm.name.trim()) {
      throw new Error("Le nom de categorie est requis");
    }

    setIsCategorySubmitting(true);

    try {
      const endpoint = categoryForm.id ? `/api/admin/categories/${categoryForm.id}` : "/api/admin/categories";
      const method = categoryForm.id ? "PATCH" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryForm.name.trim(),
          image: categoryForm.image.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorPayload?.error || "Impossible d'enregistrer la categorie");
      }

      await loadCatalog();
      setCategoryForm(emptyCategoryForm);
      setNotice(categoryForm.id ? "Categorie mise a jour" : "Categorie ajoutee");
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const removeCategory = async (categoryId: string) => {
    if (!window.confirm("Supprimer cette categorie ?")) {
      return;
    }

    const response = await fetch(`/api/admin/categories/${categoryId}`, { method: "DELETE" });

    if (!response.ok) {
      const errorPayload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(errorPayload?.error || "Suppression impossible");
    }

    await loadCatalog();

    if (form.categoryId === categoryId) {
      updateForm("categoryId", "");
    }

    setNotice("Categorie supprimee");
  };

  const sendCommunication = async () => {
    if (!communicationForm.title.trim() || !communicationForm.message.trim()) {
      throw new Error("Titre et message requis");
    }

    setIsCommunicationSubmitting(true);

    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: communicationForm.title.trim(),
          message: communicationForm.message.trim(),
        }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorPayload?.error || "Envoi impossible");
      }

      await loadCatalog();
      setCommunicationForm(emptyCommunicationForm);
      setIsCommunicationOpen(false);
      setNotice("Communication envoyee a tous les utilisateurs");
    } finally {
      setIsCommunicationSubmitting(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/login?admin=1");
  };

  return (
    <>
      {isCommunicationOpen ? (
        <div className="fixed inset-0 z-[90] flex items-end bg-slate-950/72 p-3 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6">
          <div
            className="absolute inset-0"
            aria-hidden="true"
            onClick={() => {
              if (!isCommunicationSubmitting) {
                setIsCommunicationOpen(false);
              }
            }}
          />

          <div className="relative z-10 w-full max-w-2xl rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(11,15,26,0.98),rgba(8,12,22,0.98))] p-5 shadow-[0_28px_80px_rgba(2,6,23,0.42)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/52">Communication</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Envoyer une notification globale</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/58">
                  Le message est enregistre en base puis remonte automatiquement dans l&apos;icone notifications des utilisateurs.
                </p>
              </div>

              <button
                type="button"
                aria-label="Fermer la fenetre"
                onClick={() => setIsCommunicationOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/72 transition hover:bg-white/[0.08]"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm text-white/62">Titre</span>
                <input
                  value={communicationForm.title}
                  onChange={(event) => setCommunicationForm((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/28"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-white/62">Message</span>
                <textarea
                  value={communicationForm.message}
                  onChange={(event) => setCommunicationForm((current) => ({ ...current, message: event.target.value }))}
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/28"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  sendCommunication().catch((error: Error) => setNotice(error.message));
                }}
                className="min-w-44 justify-center"
              >
                {isCommunicationSubmitting ? "Envoi..." : "Envoyer a tous"}
              </Button>
              <Button variant="secondary" onClick={() => setIsCommunicationOpen(false)}>
                Annuler
              </Button>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-white/8 bg-black/16 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">Historique</p>
                  <h3 className="mt-1 text-base font-semibold text-white">Derniers messages envoyes</h3>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/58">
                  {stats.notifications} total
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {notifications.slice(0, 4).map((notification) => (
                  <article key={notification.id} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{notification.title}</p>
                        <p className="mt-1 text-sm leading-6 text-white/58">{notification.message}</p>
                      </div>
                      <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-white/36">{formatDate(notification.createdAt)}</span>
                    </div>
                  </article>
                ))}

                {notifications.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-6 text-center text-sm text-white/54">
                    Aucune communication envoyee pour le moment.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_22%),linear-gradient(180deg,#07101d_0%,#08111f_42%,#050a14_100%)] text-white">
        <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[280px_1fr]">
          <aside className="border-b border-white/8 bg-black/18 p-5 backdrop-blur-xl lg:border-b-0 lg:border-r">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_50px_rgba(2,6,23,0.28)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/64">Admin panel</p>
              <h1 className="mt-3 font-[family-name:var(--font-orbitron)] text-2xl font-black uppercase tracking-[0.08em] text-white">Nova Admin</h1>
              <p className="mt-2 text-sm leading-6 text-white/62">Gestion unifiee du catalogue, des categories boutique et des messages globaux.</p>

              <div className="mt-6 space-y-2">
                {[
                  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                  { key: "products", label: "Catalogue", icon: Boxes },
                  { key: "editor", label: "Ajouter / Editer", icon: Plus },
                  { key: "categories", label: "Categories", icon: Tag },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = view === item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setView(item.key as ViewKey)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                        isActive ? "bg-cyan-300 text-slate-950" : "bg-white/[0.03] text-white/78 hover:bg-white/[0.08]"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-[1.4rem] border border-cyan-300/14 bg-cyan-300/8 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/52">Communication</p>
                <button
                  type="button"
                  onClick={() => setIsCommunicationOpen(true)}
                  className="mt-3 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/82 transition hover:bg-white/[0.08]"
                >
                  <span className="flex items-center gap-3">
                    <Bell className="h-4.5 w-4.5 text-cyan-200" />
                    <span>Communiquer</span>
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/52">
                    {stats.notifications}
                  </span>
                </button>
              </div>

              <div className="mt-8 grid grid-cols-4 gap-2 text-center text-xs text-white/62">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                  <Gamepad2 className="mx-auto h-4 w-4 text-cyan-200" />
                  <p className="mt-2">{stats.topups}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                  <CreditCard className="mx-auto h-4 w-4 text-fuchsia-200" />
                  <p className="mt-2">{stats.giftCards}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                  <ShoppingBag className="mx-auto h-4 w-4 text-amber-200" />
                  <p className="mt-2">{stats.shop}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
                  <Tag className="mx-auto h-4 w-4 text-emerald-200" />
                  <p className="mt-2">{stats.categories}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => logout()}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/78 transition hover:bg-white/[0.08]"
              >
                <LogOut className="h-4 w-4" />
                <span>Deconnexion</span>
              </button>
            </div>
          </aside>

          <main className="p-4 sm:p-6 lg:p-8">
            {notice ? (
              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">
                <Bell className="h-4 w-4" />
                <span>{notice}</span>
              </div>
            ) : null}

            {view === "dashboard" ? (
              <section className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {[
                    { label: "Produits total", value: stats.total, tone: "from-cyan-400/24 to-blue-500/16" },
                    { label: "Top Up", value: stats.topups, tone: "from-emerald-400/24 to-cyan-500/14" },
                    { label: "Cartes cadeaux", value: stats.giftCards, tone: "from-fuchsia-400/24 to-violet-500/16" },
                    { label: "Boutique", value: stats.shop, tone: "from-amber-400/24 to-orange-500/16" },
                    { label: "Categories", value: stats.categories, tone: "from-lime-300/18 to-emerald-500/16" },
                  ].map((card) => (
                    <article key={card.label} className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_50px_rgba(2,6,23,0.24)]">
                      <div className={`absolute inset-0 bg-linear-to-br ${card.tone}`} />
                      <div className="relative">
                        <p className="text-sm text-white/64">{card.label}</p>
                        <p className="mt-3 text-4xl font-black tracking-[-0.04em] text-white">{card.value}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_50px_rgba(2,6,23,0.24)]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/46">Apercu rapide</p>
                        <h2 className="mt-2 text-xl font-semibold text-white">Derniers ajouts</h2>
                      </div>
                      <Button variant="secondary" onClick={() => setView("products")}>Voir le catalogue</Button>
                    </div>

                    <div className="mt-5 space-y-3">
                      {stats.latest.map((product) => (
                        <article key={product.id} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-black/16 p-3">
                          <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05]">
                            <Image src={product.image} alt={product.title} fill sizes="64px" className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/56">{product.type}</p>
                            <p className="line-clamp-1 text-sm font-semibold text-white">{product.title}</p>
                            <p className="text-xs text-white/50">{formatDate(product.createdAt)}</p>
                          </div>
                          <a href={getProductHref(product)} target="_blank" rel="noreferrer" className="text-sm text-cyan-100/78 transition hover:text-white">
                            Voir
                          </a>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_50px_rgba(2,6,23,0.24)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/46">Etat du back office</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">Operations disponibles</h2>
                    <div className="mt-5 space-y-3 text-sm text-white/68">
                      <div className="rounded-2xl border border-white/8 bg-black/16 px-4 py-4">Connexion admin securisee par cookie signe</div>
                      <div className="rounded-2xl border border-white/8 bg-black/16 px-4 py-4">Categories boutique avec creation, edition et suppression reliees aux produits</div>
                      <div className="rounded-2xl border border-white/8 bg-black/16 px-4 py-4">Choix de categorie obligatoire sur chaque produit boutique</div>
                      <div className="rounded-2xl border border-white/8 bg-black/16 px-4 py-4">Communication globale envoyee en base et visible sur l&apos;icone notifications</div>
                    </div>

                    <div className="mt-6 rounded-[1.45rem] border border-rose-400/18 bg-rose-400/8 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-100/52">Notifications</p>
                          <h3 className="mt-1 text-base font-semibold text-white">{stats.notifications} messages globaux</h3>
                        </div>
                        <Button variant="secondary" onClick={() => setIsCommunicationOpen(true)}>
                          Ouvrir
                        </Button>
                      </div>

                      <div className="mt-4 space-y-3">
                        {notifications.slice(0, 3).map((notification) => (
                          <article key={notification.id} className="rounded-2xl border border-white/8 bg-black/16 px-4 py-3">
                            <p className="text-sm font-semibold text-white">{notification.title}</p>
                            <p className="mt-1 text-sm leading-6 text-white/58">{notification.message}</p>
                          </article>
                        ))}

                        {notifications.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-white/10 bg-black/14 px-4 py-5 text-sm text-white/54">
                            Aucune communication n&apos;a encore ete envoyee.
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </section>
                </div>
              </section>
            ) : null}

            {view === "products" ? (
              <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_50px_rgba(2,6,23,0.24)]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/46">Catalogue</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">Produits geres</h2>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <label className="relative block min-w-[240px]">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/34" />
                      <input
                        value={search}
                        onChange={(event) => {
                          setSearch(event.target.value);
                          setPage(1);
                        }}
                        placeholder="Rechercher un produit"
                        className="w-full rounded-2xl border border-white/10 bg-black/18 px-11 py-3 text-sm text-white outline-none transition focus:border-cyan-300/28"
                      />
                    </label>

                    <select
                      value={filterType}
                      onChange={(event) => {
                        setFilterType(event.target.value as "all" | CatalogProductType);
                        setPage(1);
                      }}
                      className="rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none"
                    >
                      <option value="all">Toutes categories</option>
                      <option value="topup">Top Up</option>
                      <option value="gift-card">Cartes cadeaux</option>
                      <option value="shop">Boutique</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {paginatedProducts.map((product) => (
                    <article key={product.id} className="grid gap-4 rounded-[1.4rem] border border-white/8 bg-black/16 p-4 lg:grid-cols-[88px_1fr_auto] lg:items-center">
                      <div className="relative h-[88px] overflow-hidden rounded-[1.2rem] border border-white/10 bg-white/[0.04]">
                        <Image src={product.image} alt={product.title} fill sizes="88px" className="object-cover" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-cyan-100/66">{product.type}</span>
                          {product.type === "shop" ? (
                            <span className="rounded-full border border-emerald-300/16 bg-emerald-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-emerald-100/78">
                              {product.category}
                            </span>
                          ) : null}
                          <span className="text-xs text-white/44">{formatDate(product.updatedAt)}</span>
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-white">{product.title}</h3>
                        <p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-6 text-white/58">{product.description}</p>
                      </div>

                      <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                        <a
                          href={getProductHref(product)}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/78 transition hover:bg-white/[0.06]"
                        >
                          Voir
                        </a>
                        <button
                          type="button"
                          onClick={() => editProduct(product)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/78 transition hover:bg-white/[0.06]"
                          aria-label={`Editer ${product.title}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            removeProduct(product.id).catch((error: Error) => setNotice(error.message));
                          }}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-red-400/20 text-red-200 transition hover:bg-red-400/10"
                          aria-label={`Supprimer ${product.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  ))}

                  {paginatedProducts.length === 0 ? (
                    <div className="rounded-[1.4rem] border border-white/8 bg-black/16 px-4 py-10 text-center text-sm text-white/54">
                      Aucun resultat pour les filtres actuels.
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 text-sm text-white/56">
                  <p>
                    Page {page} / {pageCount}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={page === 1}
                      className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-40"
                    >
                      Prec.
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                      disabled={page === pageCount}
                      className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-40"
                    >
                      Suiv.
                    </button>
                  </div>
                </div>
              </section>
            ) : null}

            {view === "categories" ? (
              <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_50px_rgba(2,6,23,0.24)]">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/46">Categories boutique</p>
                      <h2 className="mt-2 text-xl font-semibold text-white">{categoryForm.id ? "Modifier une categorie" : "Creer une categorie"}</h2>
                    </div>
                    <Button variant="secondary" onClick={() => setCategoryForm(emptyCategoryForm)}>Reinitialiser</Button>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <label className="block">
                      <span className="mb-2 block text-sm text-white/62">Nom</span>
                      <input
                        value={categoryForm.name}
                        onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))}
                        className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/28"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm text-white/62">Image optionnelle</span>
                      <input
                        value={categoryForm.image}
                        onChange={(event) => setCategoryForm((current) => ({ ...current, image: event.target.value }))}
                        placeholder="URL ou data URL"
                        className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/28"
                      />
                    </label>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      onClick={() => {
                        submitCategory().catch((error: Error) => setNotice(error.message));
                      }}
                      className="min-w-44 justify-center"
                    >
                      {isCategorySubmitting ? "Enregistrement..." : categoryForm.id ? "Mettre a jour" : "Ajouter la categorie"}
                    </Button>
                    <Button variant="secondary" onClick={() => setView("editor")}>Utiliser dans un produit</Button>
                  </div>

                  <div className="mt-6 rounded-[1.4rem] border border-emerald-300/14 bg-emerald-400/8 p-4 text-sm text-emerald-50/88">
                    Les produits boutique chargent leurs categories directement depuis la base. La selection est obligatoire au moment de la creation ou de la modification.
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_50px_rgba(2,6,23,0.24)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/46">Base categories</p>
                      <h2 className="mt-2 text-xl font-semibold text-white">{categories.length} categories disponibles</h2>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/56">
                      {catalog.shop.length} produits boutique
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {categories.map((category) => (
                      <article key={category.id} className="grid gap-4 rounded-[1.35rem] border border-white/8 bg-black/16 p-4 md:grid-cols-[1fr_auto] md:items-center">
                        <div className="flex min-w-0 items-center gap-4">
                          {category.image ? (
                            <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                              <Image src={category.image} alt={category.name} fill sizes="56px" className="object-cover" />
                            </div>
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-100/76">
                              <Tag className="h-5 w-5" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/58">
                                {category.productCount} produit{category.productCount > 1 ? "s" : ""}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-white/52">Mise a jour le {formatDate(category.updatedAt)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 md:justify-end">
                          <button
                            type="button"
                            onClick={() => setCategoryForm({ id: category.id, name: category.name, image: category.image ?? "" })}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/78 transition hover:bg-white/[0.06]"
                            aria-label={`Editer ${category.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              removeCategory(category.id).catch((error: Error) => setNotice(error.message));
                            }}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-red-400/20 text-red-200 transition hover:bg-red-400/10"
                            aria-label={`Supprimer ${category.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </article>
                    ))}

                    {categories.length === 0 ? (
                      <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-black/16 px-4 py-10 text-center text-sm text-white/54">
                        Aucune categorie en base. Creez votre premiere categorie pour pouvoir lier les produits boutique.
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>
            ) : null}

            {view === "editor" ? (
              <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_50px_rgba(2,6,23,0.24)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/46">Edition</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">{form.id ? "Modifier un produit" : "Ajouter un produit"}</h2>
                  </div>
                  <Button variant="secondary" onClick={resetForm}>Reinitialiser</Button>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm text-white/62">Type</span>
                    <select
                      value={form.type}
                      onChange={(event) => setForm({ ...emptyForm, type: event.target.value as CatalogProductType })}
                      className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none"
                    >
                      <option value="topup">Top Up</option>
                      <option value="gift-card">Carte cadeau</option>
                      <option value="shop">Boutique</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-white/62">Titre</span>
                    <input value={form.title} onChange={(event) => updateForm("title", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none" />
                  </label>

                  <label className="block lg:col-span-2">
                    <span className="mb-2 block text-sm text-white/62">Description complete</span>
                    <textarea value={form.description} onChange={(event) => updateForm("description", event.target.value)} rows={4} className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none" />
                  </label>

                  <label className="block lg:col-span-2">
                    <span className="mb-2 block text-sm text-white/62">Images galerie (la premiere sera l&apos;image principale)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(event) => {
                        const files = event.target.files;
                        if (!files || files.length === 0) {
                          return;
                        }
                        filesToDataUrls(files)
                          .then((values) => updateForm("images", values))
                          .catch((error: Error) => setNotice(error.message));
                      }}
                      className="w-full rounded-2xl border border-dashed border-white/16 bg-black/18 px-4 py-3 text-sm text-white outline-none file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
                    />
                    {form.images.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {form.images.map((image, index) => (
                          <div key={`${image.slice(0, 24)}-${index}`} className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                            <Image src={image} alt={`preview-${index}`} fill sizes="80px" className="object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </label>

                  {form.type === "topup" ? (
                    <>
                      <label className="block">
                        <span className="mb-2 block text-sm text-white/62">Slug</span>
                        <input value={form.slug} onChange={(event) => updateForm("slug", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm text-white/62">Genre</span>
                        <input value={form.genre} onChange={(event) => updateForm("genre", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm text-white/62">Sous-titre</span>
                        <input value={form.subtitle} onChange={(event) => updateForm("subtitle", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm text-white/62">CTA</span>
                        <input value={form.ctaLabel} onChange={(event) => updateForm("ctaLabel", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none" />
                      </label>
                      <label className="block lg:col-span-2">
                        <span className="mb-2 block text-sm text-white/62">Highlights, une ligne par point</span>
                        <textarea value={form.purchaseHighlights} onChange={(event) => updateForm("purchaseHighlights", event.target.value)} rows={4} className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none" />
                      </label>
                      <div className="lg:col-span-2">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="text-sm text-white/62">Tarifs dynamiques</span>
                          <button
                            type="button"
                            onClick={() => updateForm("prices", [...form.prices, { id: `price-${form.prices.length}`, label: "", subtitle: "", price: "", badge: "" }])}
                            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/78"
                          >
                            Ajouter un tarif
                          </button>
                        </div>
                        <div className="space-y-3">
                          {form.prices.map((priceRow, index) => (
                            <div key={priceRow.id || index} className="grid gap-3 rounded-2xl border border-white/8 bg-black/16 p-3 md:grid-cols-4">
                              <input
                                value={priceRow.label}
                                onChange={(event) => {
                                  const next = [...form.prices];
                                  next[index] = { ...next[index], label: event.target.value };
                                  updateForm("prices", next);
                                }}
                                placeholder="Pack"
                                className="rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none"
                              />
                              <input
                                value={priceRow.subtitle ?? ""}
                                onChange={(event) => {
                                  const next = [...form.prices];
                                  next[index] = { ...next[index], subtitle: event.target.value };
                                  updateForm("prices", next);
                                }}
                                placeholder="Description"
                                className="rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none"
                              />
                              <input
                                value={priceRow.price}
                                onChange={(event) => {
                                  const next = [...form.prices];
                                  next[index] = { ...next[index], price: event.target.value };
                                  updateForm("prices", next);
                                }}
                                placeholder="19,99 EUR"
                                className="rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none"
                              />
                              <input
                                value={priceRow.badge ?? ""}
                                onChange={(event) => {
                                  const next = [...form.prices];
                                  next[index] = { ...next[index], badge: event.target.value };
                                  updateForm("prices", next);
                                }}
                                placeholder="Badge"
                                className="rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}

                  {form.type === "gift-card" ? (
                    <>
                      <label className="block">
                        <span className="mb-2 block text-sm text-white/62">Marque</span>
                        <input value={form.brand} onChange={(event) => updateForm("brand", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm text-white/62">Montant</span>
                        <input value={form.amount} onChange={(event) => updateForm("amount", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none" />
                      </label>
                      <label className="block lg:col-span-2">
                        <span className="mb-2 block text-sm text-white/62">Badge visuel</span>
                        <input value={form.badge} onChange={(event) => updateForm("badge", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none" />
                      </label>
                    </>
                  ) : null}

                  {form.type === "shop" ? (
                    <>
                      <label className="block">
                        <span className="mb-2 block text-sm text-white/62">Categorie</span>
                        <select
                          value={form.categoryId}
                          onChange={(event) => updateForm("categoryId", event.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none"
                          disabled={categories.length === 0}
                        >
                          <option value="">Choisir une categorie</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm text-white/62">Prix</span>
                        <input value={form.price} onChange={(event) => updateForm("price", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm text-white/62">Badge</span>
                        <input value={form.badge} onChange={(event) => updateForm("badge", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm text-white/62">Stock</span>
                        <input value={form.stock} onChange={(event) => updateForm("stock", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white outline-none" />
                      </label>

                      {categories.length === 0 ? (
                        <div className="lg:col-span-2 rounded-[1.4rem] border border-amber-300/18 bg-amber-400/10 px-4 py-4 text-sm text-amber-50/86">
                          Aucune categorie disponible. Creez d&apos;abord une categorie dans la section Categories avant de publier un produit boutique.
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    onClick={() => {
                      startTransition(() => {
                        submitForm().catch((error: Error) => setNotice(error.message));
                      });
                    }}
                    className="min-w-44 justify-center"
                  >
                    {isPending ? "Enregistrement..." : form.id ? "Mettre a jour" : "Publier le produit"}
                  </Button>
                  <Button variant="secondary" onClick={() => setView("products")}>Retour catalogue</Button>
                </div>
              </section>
            ) : null}
          </main>
        </div>
      </div>
    </>
  );
}