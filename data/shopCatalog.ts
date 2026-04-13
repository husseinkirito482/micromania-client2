import { products as baseProducts } from "@/data/storefront";

export type ShopCategory = "Toutes" | "Telephones" | "Accessoires" | "Cartes cadeaux" | "Jeux" | "Autres";

export type ShopProduct = {
  id: string;
  name: string;
  price: string;
  image: string;
  category: ShopCategory;
  description: string;
  badge?: string;
  createdAt: string;
};

export const shopCategories: ShopCategory[] = ["Toutes", "Telephones", "Accessoires", "Cartes cadeaux", "Jeux", "Autres"];

export const shopProducts: ShopProduct[] = [
  {
    id: baseProducts[1]?.id ?? "apex-core",
    name: "Apex Phone Grip",
    price: baseProducts[1]?.price ?? "89,99 EUR",
    image: baseProducts[1]?.image ?? "/products/apex-core.svg",
    category: "Telephones",
    description: "Support ergonomique et finition premium pour smartphone.",
    badge: "Nouveau",
    createdAt: "2026-03-05T09:00:00.000Z",
  },
  {
    id: baseProducts[0]?.id ?? "pulse-nova",
    name: "Pulse Nova Earbuds",
    price: baseProducts[0]?.price ?? "199,99 EUR",
    image: baseProducts[0]?.image ?? "/products/pulse-nova.svg",
    category: "Accessoires",
    description: "Ecouteurs sans fil avec reduction de bruit et boitier compact.",
    badge: "Best-seller",
    createdAt: "2026-03-07T09:00:00.000Z",
  },
  {
    id: "nova-gift-card-100",
    name: "Nova Gift Card 100",
    price: "100,00 EUR",
    image: baseProducts[3]?.image ?? "/products/crimson-vault.svg",
    category: "Cartes cadeaux",
    description: "Credit instantane a offrir ou a utiliser pour vos achats.",
    createdAt: "2026-03-09T09:00:00.000Z",
  },
  {
    id: "crimson-idol-box",
    name: "Console Travel Case",
    price: "129,99 EUR",
    image: baseProducts[3]?.image ?? "/products/crimson-vault.svg",
    category: "Accessoires",
    description: "Housse rigide premium pour transporter votre console et accessoires.",
    createdAt: "2026-03-11T09:00:00.000Z",
  },
  {
    id: baseProducts[2]?.id ?? "nebula-rtx",
    name: "Nebula Game Station",
    price: baseProducts[2]?.price ?? "1 799,99 EUR",
    image: baseProducts[2]?.image ?? "/products/nebula-station.svg",
    category: "Jeux",
    description: "Station complete pour jouer, streamer et travailler sans compromis.",
    badge: "Premium",
    createdAt: "2026-03-13T09:00:00.000Z",
  },
  {
    id: "otaku-night-lamp",
    name: "Chargeur 3-en-1 Nova",
    price: "59,99 EUR",
    image: baseProducts[0]?.image ?? "/products/pulse-nova.svg",
    category: "Telephones",
    description: "Chargeur compact pour telephone, ecouteurs et montre connectee.",
    createdAt: "2026-03-15T09:00:00.000Z",
  },
  {
    id: "starter-access-pack",
    name: "Starter Access Pack",
    price: "79,99 EUR",
    image: baseProducts[1]?.image ?? "/products/apex-core.svg",
    category: "Accessoires",
    description: "Selection d'accessoires essentiels pour bien equiper votre setup.",
    createdAt: "2026-03-17T09:00:00.000Z",
  },
  {
    id: "gift-card-ultimate",
    name: "Gift Card Ultimate",
    price: "250,00 EUR",
    image: baseProducts[3]?.image ?? "/products/crimson-vault.svg",
    category: "Cartes cadeaux",
    description: "Le format ideal pour un cadeau premium ou un gros panier.",
    createdAt: "2026-03-19T09:00:00.000Z",
  },
  {
    id: "support-nova-desk",
    name: "Support Nova Desk",
    price: "39,99 EUR",
    image: baseProducts[1]?.image ?? "/products/apex-core.svg",
    category: "Autres",
    description: "Support de bureau sobre et reglable pour tablette ou smartphone.",
    createdAt: "2026-03-21T09:00:00.000Z",
  },
];