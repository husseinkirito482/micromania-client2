export type GiftCardProduct = {
  id: string;
  brand: string;
  amount: string;
  accent: string;
  badge: string;
  mono: string;
  image: string;
  createdAt: string;
};

export const giftCards: GiftCardProduct[] = [
  {
    id: "gift-playstation-10",
    brand: "PlayStation",
    amount: "10 EUR",
    accent: "from-blue-400/18 via-cyan-400/12 to-violet-500/18",
    badge: "PS",
    mono: "text-cyan-100",
    image: "/products/crimson-vault.svg",
    createdAt: "2026-03-10T10:00:00.000Z",
  },
  {
    id: "gift-xbox-20",
    brand: "Xbox",
    amount: "20 EUR",
    accent: "from-emerald-400/18 via-cyan-400/10 to-slate-300/14",
    badge: "XB",
    mono: "text-emerald-100",
    image: "/products/apex-core.svg",
    createdAt: "2026-03-14T10:00:00.000Z",
  },
  {
    id: "gift-steam-50",
    brand: "Steam",
    amount: "50 EUR",
    accent: "from-slate-200/14 via-sky-500/12 to-indigo-500/18",
    badge: "ST",
    mono: "text-slate-100",
    image: "/products/nebula-station.svg",
    createdAt: "2026-03-18T10:00:00.000Z",
  },
  {
    id: "gift-free-fire-15",
    brand: "Free Fire",
    amount: "15 EUR",
    accent: "from-orange-400/18 via-red-500/12 to-amber-300/18",
    badge: "FF",
    mono: "text-orange-100",
    image: "/games/redline-reborn.svg",
    createdAt: "2026-03-22T10:00:00.000Z",
  },
  {
    id: "gift-roblox-25",
    brand: "Roblox",
    amount: "25 EUR",
    accent: "from-rose-400/18 via-fuchsia-500/12 to-violet-500/18",
    badge: "RB",
    mono: "text-rose-100",
    image: "/games/phantom-grid.svg",
    createdAt: "2026-03-26T10:00:00.000Z",
  },
];