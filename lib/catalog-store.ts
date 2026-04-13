import { giftCards as seedGiftCards } from "@/data/giftCards";
import { gameApps as seedTopUps } from "@/data/gameApps";
import { shopProducts as seedShopProducts } from "@/data/shopCatalog";
import { promises as fs } from "fs";
import path from "path";

export type CatalogProductType = "topup" | "gift-card" | "shop";

export type CatalogPriceOption = {
  id: string;
  label: string;
  subtitle?: string;
  price: string;
  badge?: string;
};

type CatalogItemBase = {
  id: string;
  type: CatalogProductType;
  title: string;
  description: string;
  image: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

export type CatalogTopUpItem = CatalogItemBase & {
  type: "topup";
  slug: string;
  subtitle: string;
  genre: string;
  accent: string;
  glow: string;
  ctaLabel: string;
  purchaseHighlights: string[];
  prices: CatalogPriceOption[];
  descriptionSections: Array<{ title: string; body: string }>;
};

export type CatalogGiftCardItem = CatalogItemBase & {
  type: "gift-card";
  brand: string;
  amount: string;
  accent: string;
  badge: string;
  mono: string;
};

export type CatalogShopItem = CatalogItemBase & {
  type: "shop";
  categoryId: string;
  category: string;
  price: string;
  badge?: string;
  stock?: number;
  ratingTotal: number;
  ratingCount: number;
};

export type ShopCategoryItem = {
  id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export type GlobalNotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
};

export type CatalogData = {
  topups: CatalogTopUpItem[];
  giftCards: CatalogGiftCardItem[];
  shop: CatalogShopItem[];
  categories: ShopCategoryItem[];
  notifications: GlobalNotificationItem[];
};

export type CatalogAdminPayload = {
  id?: string;
  type: CatalogProductType;
  title: string;
  description: string;
  images: string[];
  subtitle?: string;
  genre?: string;
  accent?: string;
  glow?: string;
  ctaLabel?: string;
  purchaseHighlights?: string[];
  prices?: CatalogPriceOption[];
  slug?: string;
  brand?: string;
  amount?: string;
  badge?: string;
  mono?: string;
  category?: string;
  price?: string;
  stock?: number;
  categoryId?: string;
};

export type ShopCategoryPayload = {
  name: string;
  image?: string;
};

const notificationsPageSize = 10;

const catalogPath = path.join(process.cwd(), "data", "catalog-db.json");

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createSeedCatalog(): CatalogData {
  const categories = Array.from(new Set(seedShopProducts.map((product) => product.category))).map((name) => ({
    id: slugify(name),
    name,
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
  }));

  return {
    topups: seedTopUps.map((game) => ({
      id: game.slug,
      type: "topup",
      slug: game.slug,
      title: game.title,
      subtitle: game.subtitle,
      genre: game.genre,
      description: game.description,
      image: game.image,
      images: [game.image],
      createdAt: game.createdAt,
      updatedAt: game.createdAt,
      accent: game.accent,
      glow: game.glow,
      ctaLabel: game.ctaLabel,
      purchaseHighlights: game.purchaseHighlights,
      descriptionSections: game.descriptionSections,
      prices: game.topUpOptions.map((option) => ({
        id: option.id,
        label: option.title,
        subtitle: option.subtitle,
        price: option.price,
        badge: option.badge,
      })),
    })),
    giftCards: seedGiftCards.map((card) => ({
      id: card.id,
      type: "gift-card",
      title: `${card.brand} ${card.amount}`,
      description: `${card.brand} ${card.amount}`,
      image: card.image,
      images: [card.image],
      createdAt: card.createdAt,
      updatedAt: card.createdAt,
      brand: card.brand,
      amount: card.amount,
      accent: card.accent,
      badge: card.badge,
      mono: card.mono,
    })),
    shop: seedShopProducts.map((product) => ({
      id: product.id,
      type: "shop",
      title: product.name,
      description: product.description,
      image: product.image,
      images: [product.image],
      createdAt: product.createdAt,
      updatedAt: product.createdAt,
      categoryId: slugify(product.category),
      category: product.category,
      price: product.price,
      badge: product.badge,
      stock: 0,
      ratingTotal: 0,
      ratingCount: 0,
    })),
    categories,
    notifications: [],
  };
}

function ensureCatalogShape(data: Partial<CatalogData>): CatalogData {
  const categoriesFromShop = Array.from(
    new Map(
      (data.shop ?? []).map((product) => {
        const name = product.category || "Autres";
        const id = "categoryId" in product && product.categoryId ? product.categoryId : slugify(name);
        return [id, { id, name, createdAt: product.createdAt, updatedAt: product.updatedAt }];
      }),
    ).values(),
  );

  const categories = (data.categories ?? []).length > 0 ? data.categories! : categoriesFromShop;
  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  const normalizedShop = (data.shop ?? []).map((product) => {
    const categoryName = product.category || "Autres";
    const categoryId = "categoryId" in product && product.categoryId ? product.categoryId : slugify(categoryName);
    const category = categoryMap.get(categoryId);

    return {
      ...product,
      categoryId,
      category: category?.name || categoryName,
      ratingTotal: "ratingTotal" in product && typeof product.ratingTotal === "number" ? product.ratingTotal : 0,
      ratingCount: "ratingCount" in product && typeof product.ratingCount === "number" ? product.ratingCount : 0,
    };
  });

  return {
    topups: data.topups ?? [],
    giftCards: data.giftCards ?? [],
    shop: normalizedShop,
    categories,
    notifications: data.notifications ?? [],
  };
}

async function ensureCatalogFile() {
  try {
    await fs.access(catalogPath);
  } catch {
    await fs.mkdir(path.dirname(catalogPath), { recursive: true });
    await fs.writeFile(catalogPath, JSON.stringify(createSeedCatalog(), null, 2), "utf8");
  }
}

export async function readCatalogData(): Promise<CatalogData> {
  await ensureCatalogFile();
  const raw = await fs.readFile(catalogPath, "utf8");
  const parsed = ensureCatalogShape(JSON.parse(raw) as Partial<CatalogData>);
  return parsed;
}

export async function writeCatalogData(data: CatalogData) {
  await fs.writeFile(catalogPath, JSON.stringify(data, null, 2), "utf8");
}

export async function getCatalogStats() {
  const data = await readCatalogData();
  const total = data.topups.length + data.giftCards.length + data.shop.length;
  const latest = [...data.topups, ...data.giftCards, ...data.shop]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 5);

  return {
    total,
    topups: data.topups.length,
    giftCards: data.giftCards.length,
    shop: data.shop.length,
    categories: data.categories.length,
    notifications: data.notifications.length,
    latest,
  };
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function ensureImages(images: string[]) {
  return images.length > 0 ? images : ["/image.png"];
}

function getCategoryOrThrow(data: CatalogData, categoryId?: string) {
  const normalizedCategoryId = categoryId?.trim();

  if (!normalizedCategoryId) {
    throw new Error("Category required");
  }

  const category = data.categories.find((item) => item.id === normalizedCategoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}

export async function createCatalogItem(payload: CatalogAdminPayload) {
  const data = await readCatalogData();
  const now = new Date().toISOString();
  const images = ensureImages(payload.images);

  if (payload.type === "topup") {
    const slug = payload.slug?.trim() || slugify(payload.title);
    const item: CatalogTopUpItem = {
      id: payload.id ?? makeId("topup"),
      type: "topup",
      slug,
      title: payload.title,
      subtitle: payload.subtitle?.trim() || "Nouveau top up",
      genre: payload.genre?.trim() || "Top up mobile",
      description: payload.description,
      image: images[0],
      images,
      createdAt: now,
      updatedAt: now,
      accent: payload.accent?.trim() || "from-cyan-400/24 via-blue-500/18 to-violet-500/22",
      glow: payload.glow?.trim() || "shadow-[0_18px_40px_rgba(76,201,255,0.18)]",
      ctaLabel: payload.ctaLabel?.trim() || "Explorer",
      purchaseHighlights: payload.purchaseHighlights?.filter(Boolean) ?? ["Ajout admin", "Mobile ready", "Paiement securise"],
      descriptionSections: [
        {
          title: "Comment acheter",
          body: payload.description,
        },
        {
          title: "Livraison",
          body: "Produit ajoute depuis l'administration avec synchronisation automatique sur le storefront.",
        },
      ],
      prices: (payload.prices ?? []).filter((option) => option.label && option.price).map((option, index) => ({
        id: option.id || `${slug}-${index}`,
        label: option.label,
        subtitle: option.subtitle,
        price: option.price,
        badge: option.badge,
      })),
    };
    data.topups.unshift(item);
    await writeCatalogData(data);
    return item;
  }

  if (payload.type === "gift-card") {
    const item: CatalogGiftCardItem = {
      id: payload.id ?? makeId("gift"),
      type: "gift-card",
      title: payload.title,
      description: payload.description || payload.title,
      image: images[0],
      images,
      createdAt: now,
      updatedAt: now,
      brand: payload.brand?.trim() || payload.title,
      amount: payload.amount?.trim() || payload.price?.trim() || "10 EUR",
      accent: payload.accent?.trim() || "from-violet-500/26 via-fuchsia-400/16 to-transparent",
      badge: payload.badge?.trim() || "GC",
      mono: payload.mono?.trim() || "text-violet-100",
    };
    data.giftCards.unshift(item);
    await writeCatalogData(data);
    return item;
  }

  const category = getCategoryOrThrow(data, payload.categoryId);

  const item: CatalogShopItem = {
    id: payload.id ?? makeId("shop"),
    type: "shop",
    title: payload.title,
    description: payload.description,
    image: images[0],
    images,
    createdAt: now,
    updatedAt: now,
    categoryId: category.id,
    category: category.name,
    price: payload.price?.trim() || "0,00 EUR",
    badge: payload.badge?.trim() || undefined,
    stock: payload.stock,
    ratingTotal: 0,
    ratingCount: 0,
  };
  data.shop.unshift(item);
  await writeCatalogData(data);
  return item;
}

export async function updateCatalogItem(itemId: string, payload: CatalogAdminPayload) {
  const data = await readCatalogData();
  const now = new Date().toISOString();

  const updateList = <T extends { id: string }>(items: T[], updater: (item: T) => T) => {
    const index = items.findIndex((item) => item.id === itemId);
    if (index === -1) {
      return false;
    }
    items[index] = updater(items[index]);
    return true;
  };

  const topupUpdated = updateList(data.topups, (item) => ({
    ...item,
    title: payload.title ?? item.title,
    description: payload.description ?? item.description,
    subtitle: payload.subtitle ?? item.subtitle,
    genre: payload.genre ?? item.genre,
    image: payload.images?.[0] ?? item.image,
    images: payload.images?.length ? payload.images : item.images,
    updatedAt: now,
    prices: payload.prices?.length
      ? payload.prices.map((option, index) => ({
          id: option.id || `${item.slug}-${index}`,
          label: option.label,
          subtitle: option.subtitle,
          price: option.price,
          badge: option.badge,
        }))
      : item.prices,
    descriptionSections: item.descriptionSections,
  }));

  const giftUpdated = !topupUpdated && updateList(data.giftCards, (item) => ({
    ...item,
    title: payload.title ?? item.title,
    description: payload.description ?? item.description,
    brand: payload.brand ?? item.brand,
    amount: payload.amount ?? item.amount,
    image: payload.images?.[0] ?? item.image,
    images: payload.images?.length ? payload.images : item.images,
    updatedAt: now,
  }));

  const shopUpdated = !topupUpdated && !giftUpdated && updateList(data.shop, (item) => {
    const category = getCategoryOrThrow(data, payload.categoryId ?? item.categoryId);

    return {
      ...item,
      title: payload.title ?? item.title,
      description: payload.description ?? item.description,
      categoryId: category.id,
      category: category.name,
      price: payload.price ?? item.price,
      badge: payload.badge ?? item.badge,
      stock: payload.stock ?? item.stock,
      image: payload.images?.[0] ?? item.image,
      images: payload.images?.length ? payload.images : item.images,
      updatedAt: now,
      ratingTotal: item.ratingTotal,
      ratingCount: item.ratingCount,
    };
  });

  if (!topupUpdated && !giftUpdated && !shopUpdated) {
    throw new Error("Product not found");
  }

  await writeCatalogData(data);
}

export async function deleteCatalogItem(itemId: string) {
  const data = await readCatalogData();
  data.topups = data.topups.filter((item) => item.id !== itemId);
  data.giftCards = data.giftCards.filter((item) => item.id !== itemId);
  data.shop = data.shop.filter((item) => item.id !== itemId);
  await writeCatalogData(data);
}

export async function createShopCategory(payload: ShopCategoryPayload) {
  const data = await readCatalogData();
  const now = new Date().toISOString();
  const category: ShopCategoryItem = {
    id: slugify(payload.name),
    name: payload.name.trim(),
    image: payload.image?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  if (data.categories.some((item) => item.id === category.id)) {
    throw new Error("Category already exists");
  }

  data.categories.unshift(category);
  await writeCatalogData(data);
  return category;
}

export async function updateShopCategory(categoryId: string, payload: ShopCategoryPayload) {
  const data = await readCatalogData();
  const category = data.categories.find((item) => item.id === categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  category.name = payload.name.trim();
  category.image = payload.image?.trim() || undefined;
  category.updatedAt = new Date().toISOString();

  data.shop = data.shop.map((product) =>
    product.categoryId === categoryId ? { ...product, category: category.name } : product,
  );

  await writeCatalogData(data);
  return category;
}

export async function deleteShopCategory(categoryId: string) {
  const data = await readCatalogData();
  const inUseCount = data.shop.filter((product) => product.categoryId === categoryId).length;

  if (inUseCount > 0) {
    throw new Error("Category in use");
  }

  data.categories = data.categories.filter((item) => item.id !== categoryId);
  await writeCatalogData(data);
}

export async function listShopCategoriesWithCounts() {
  const data = await readCatalogData();
  return data.categories.map((category) => ({
    ...category,
    productCount: data.shop.filter((product) => product.categoryId === category.id).length,
  }));
}

export async function createGlobalNotification(title: string, message: string) {
  const data = await readCatalogData();
  const notification: GlobalNotificationItem = {
    id: makeId("notification"),
    title: title.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  data.notifications.unshift(notification);
  await writeCatalogData(data);
  return notification;
}

export async function deleteGlobalNotification(notificationId: string) {
  const data = await readCatalogData();
  data.notifications = data.notifications.filter((item) => item.id !== notificationId);
  await writeCatalogData(data);
}

export async function listGlobalNotifications(page = 1) {
  const data = await readCatalogData();
  const sorted = data.notifications
    .slice()
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

  return {
    items: sorted.slice((page - 1) * notificationsPageSize, page * notificationsPageSize),
    total: sorted.length,
    page,
    pageSize: notificationsPageSize,
    pageCount: Math.max(1, Math.ceil(sorted.length / notificationsPageSize)),
  };
}

export async function getTopUpBySlug(slug: string) {
  const data = await readCatalogData();
  return data.topups.find((item) => item.slug === slug);
}

export async function getShopProductById(productId: string) {
  const data = await readCatalogData();
  return data.shop.find((item) => item.id === productId);
}

export async function addShopProductRating(productId: string, rating: number) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Invalid rating");
  }

  const data = await readCatalogData();
  const product = data.shop.find((item) => item.id === productId);

  if (!product) {
    throw new Error("Product not found");
  }

  product.ratingTotal += rating;
  product.ratingCount += 1;
  product.updatedAt = new Date().toISOString();

  await writeCatalogData(data);

  return {
    ratingCount: product.ratingCount,
    ratingAverage: product.ratingCount > 0 ? product.ratingTotal / product.ratingCount : 0,
  };
}