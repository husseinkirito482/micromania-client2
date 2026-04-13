export type Category = {
  label: string;
  icon: "controller" | "headset" | "pc" | "gift" | "figure" | "plus";
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  platform: string;
  badge: string;
};

export type Game = {
  title: string;
  eyebrow: string;
  description: string;
  image: string;
};

export const categories: Category[] = [
  { label: "Jeux", icon: "controller" },
  { label: "Accessoires", icon: "headset" },
  { label: "PC Gaming", icon: "pc" },
  { label: "Cartes Cadeaux", icon: "gift" },
  { label: "Figurines", icon: "figure" },
  { label: "Promos", icon: "plus" },
];

export const products: Product[] = [
  {
    id: "pulse-nova",
    name: "Pulse Nova Wireless Pro",
    category: "Casque gaming",
    price: "199,99 EUR",
    image: "/products/pulse-nova.svg",
    platform: "PS5 / PC",
    badge: "Best seller",
  },
  {
    id: "apex-core",
    name: "Apex Core Elite Pad",
    category: "Controller",
    price: "89,99 EUR",
    image: "/products/apex-core.svg",
    platform: "Multi",
    badge: "Nouveau",
  },
  {
    id: "nebula-rtx",
    name: "Nebula RTX Station",
    category: "PC gaming",
    price: "1 799,99 EUR",
    image: "/products/nebula-station.svg",
    platform: "PC",
    badge: "Edition limit",
  },
  {
    id: "crimson-vault",
    name: "Collector Crimson Vault",
    category: "Collector",
    price: "129,99 EUR",
    image: "/products/crimson-vault.svg",
    platform: "XSX / PS5",
    badge: "Rare",
  },
];

export const games: Game[] = [
  {
    title: "Phantom Grid",
    eyebrow: "Cyber action RPG",
    description: "Course tactique, city lights et campagne coop qui pousse les visuels plein ecran.",
    image: "/games/phantom-grid.svg",
  },
  {
    title: "Redline Reborn",
    eyebrow: "Racing / World Tour",
    description: "Desert neon, hypercars et image hero prete pour les precommandes haute conversion.",
    image: "/games/redline-reborn.svg",
  },
  {
    title: "Titan Protocol",
    eyebrow: "Sci-fi shooter",
    description: "Front intergalactique, squad elite et composition dramatique pour les mises en avant premium.",
    image: "/games/titan-protocol.svg",
  },
];