export type GameApp = {
  slug: string;
  title: string;
  subtitle: string;
  genre: string;
  image: string;
  createdAt: string;
  iconLabel: string;
  accent: string;
  glow: string;
  description: string;
  ctaLabel: string;
  purchaseHighlights: string[];
  topUpOptions: GameTopUpOption[];
  descriptionSections: GameDescriptionSection[];
};

export type GameTopUpOption = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  ctaLabel: string;
  badge?: string;
};

export type GameDescriptionSection = {
  title: string;
  body: string;
};

type GameSeed = Omit<GameApp, "topUpOptions" | "descriptionSections"> & {
  currencyLabel: string;
};

function createTopUpOptions(currencyLabel: string): GameTopUpOption[] {
  return [
    {
      id: `${currencyLabel}-starter`,
      title: `100 ${currencyLabel}`,
      subtitle: "Activation rapide et format ideal pour tester",
      price: "1,99€",
      ctaLabel: "Ajouter au panier",
    },
    {
      id: `${currencyLabel}-boost`,
      title: `500 ${currencyLabel}`,
      subtitle: "Le meilleur equilibre entre prix et progression",
      price: "7,99€",
      ctaLabel: "Acheter",
      badge: "Populaire",
    },
    {
      id: `${currencyLabel}-max`,
      title: `1000 ${currencyLabel}`,
      subtitle: "Le pack premium pour recharger sans attendre",
      price: "14,99€",
      ctaLabel: "Acheter",
    },
  ];
}

function createDescriptionSections(title: string, currencyLabel: string): GameDescriptionSection[] {
  return [
    {
      title: "Comment fonctionnent les recharges",
      body: `Choisissez le pack ${currencyLabel} adapte a votre besoin, validez la commande puis recevez votre recharge avec un parcours simple et rapide, pense pour le mobile.`,
    },
    {
      title: "Pourquoi acheter ici",
      body: `${title} profite d'une fiche plus claire, avec des offres lisibles, un bouton d'achat evident et une hierarchie qui va droit au but pour favoriser la conversion.`,
    },
    {
      title: "Informations utiles",
      body: "Cette structure est preparee pour etre alimentee par une future interface admin: image, nom du jeu, offres, prix et contenu descriptif peuvent etre remplaces par des donnees dynamiques sans refaire la page.",
    },
  ];
}

const gameSeeds: GameSeed[] = [
  {
    slug: "free-fire",
    title: "Free Fire",
    subtitle: "Drop rapide",
    genre: "Battle royale mobile",
    image: "/games/redline-reborn.svg",
    createdAt: "2026-02-12T08:00:00.000Z",
    iconLabel: "FF",
    accent: "from-orange-300/28 via-red-500/18 to-fuchsia-500/26",
    glow: "shadow-[0_18px_40px_rgba(248,113,113,0.22)]",
    description: "Des sessions nerveuses, un acces immediat et une fiche pensee comme une app premium tres rapide a parcourir.",
    ctaLabel: "Lancer l'univers",
    currencyLabel: "diamants",
    purchaseHighlights: ["Livraison instantanee", "Activation mobile", "Paiement securise"],
  },
  {
    slug: "roblox",
    title: "Roblox",
    subtitle: "Creation sociale",
    genre: "Sandbox communautaire",
    image: "/games/phantom-grid.svg",
    createdAt: "2026-02-15T08:00:00.000Z",
    iconLabel: "RB",
    accent: "from-slate-200/24 via-cyan-400/14 to-violet-500/24",
    glow: "shadow-[0_18px_40px_rgba(76,201,255,0.2)]",
    description: "Une entree claire vers une plateforme sociale et creative, avec un rendu plus proche d'un launcher mobile que d'un catalogue e-commerce.",
    ctaLabel: "Voir la fiche",
    currencyLabel: "robux",
    purchaseHighlights: ["Codes rapides", "Compatible mobile", "Offres lisibles"],
  },
  {
    slug: "valorant-mobile",
    title: "Valorant",
    subtitle: "Precision tactique",
    genre: "FPS competitif",
    image: "/games/titan-protocol.svg",
    createdAt: "2026-02-18T08:00:00.000Z",
    iconLabel: "VL",
    accent: "from-rose-400/28 via-red-500/18 to-cyan-400/16",
    glow: "shadow-[0_18px_40px_rgba(251,113,133,0.2)]",
    description: "Une identite nette, contrastee et premium pour un jeu competitif qui merite une presentation directe et lisible.",
    ctaLabel: "Explorer",
    currencyLabel: "points",
    purchaseHighlights: ["Checkout rapide", "Carte claire", "UX mobile premium"],
  },
  {
    slug: "genshin-impact",
    title: "Genshin",
    subtitle: "Anime world",
    genre: "Action RPG",
    image: "/games/phantom-grid.svg",
    createdAt: "2026-02-21T08:00:00.000Z",
    iconLabel: "GI",
    accent: "from-cyan-300/24 via-sky-400/18 to-indigo-500/24",
    glow: "shadow-[0_18px_40px_rgba(56,189,248,0.18)]",
    description: "Une presentation douce, lumineuse et futuriste legere, calibree pour un univers anime sans tomber dans le style gamer agressif.",
    ctaLabel: "Decouvrir",
    currencyLabel: "cristaux",
    purchaseHighlights: ["Recharge fiable", "Parcours fluide", "Infos utiles visibles"],
  },
  {
    slug: "honkai-star-rail",
    title: "Honkai SR",
    subtitle: "Space anime",
    genre: "RPG strategique",
    image: "/games/titan-protocol.svg",
    createdAt: "2026-02-24T08:00:00.000Z",
    iconLabel: "HS",
    accent: "from-violet-400/30 via-fuchsia-500/18 to-sky-400/18",
    glow: "shadow-[0_18px_40px_rgba(168,85,247,0.2)]",
    description: "Une fiche editoriale plus propre et plus mobile-first pour mettre l'accent sur la vitesse d'exploration.",
    ctaLabel: "Ouvrir la fiche",
    currencyLabel: "jades",
    purchaseHighlights: ["Offres comparees", "Navigation nette", "Structure moderne"],
  },
  {
    slug: "zenless-zone-zero",
    title: "ZZZ",
    subtitle: "Urban anime",
    genre: "Action stylisee",
    image: "/games/redline-reborn.svg",
    createdAt: "2026-02-27T08:00:00.000Z",
    iconLabel: "ZZ",
    accent: "from-amber-300/24 via-orange-500/18 to-red-500/22",
    glow: "shadow-[0_18px_40px_rgba(251,146,60,0.18)]",
    description: "Une presentation compacte avec plus d'impact visuel, pensee comme une app native prete a etre touchee du pouce.",
    ctaLabel: "Afficher",
    currencyLabel: "monochromes",
    purchaseHighlights: ["CTA visible", "Visuel compact", "Achat simplifie"],
  },
  {
    slug: "wuthering-waves",
    title: "Wuthering",
    subtitle: "Echo futuriste",
    genre: "Open-world action",
    image: "/games/phantom-grid.svg",
    createdAt: "2026-03-02T08:00:00.000Z",
    iconLabel: "WW",
    accent: "from-sky-300/24 via-cyan-400/18 to-emerald-400/20",
    glow: "shadow-[0_18px_40px_rgba(34,211,238,0.18)]",
    description: "L'agencement met en avant l'aspect application mobile avec une iconographie simple et une interaction rapide.",
    ctaLabel: "Entrer",
    currencyLabel: "lunites",
    purchaseHighlights: ["Acces direct", "Lecture rapide", "Layout conversion"],
  },
  {
    slug: "project-mugen",
    title: "Mugen",
    subtitle: "City anime",
    genre: "Open-world anime",
    image: "/games/redline-reborn.svg",
    createdAt: "2026-03-05T08:00:00.000Z",
    iconLabel: "MG",
    accent: "from-pink-400/24 via-violet-500/18 to-cyan-300/20",
    glow: "shadow-[0_18px_40px_rgba(192,132,252,0.18)]",
    description: "Une destination directe et claire, avec un ton plus editorial que produit pour mieux inviter au clic.",
    ctaLabel: "Voir plus",
    currencyLabel: "credits",
    purchaseHighlights: ["Choix simple", "Hierarchie claire", "Experience mobile"],
  },
  {
    slug: "blue-lock-rivals",
    title: "Blue Lock",
    subtitle: "Anime arena",
    genre: "Competitive action",
    image: "/games/titan-protocol.svg",
    createdAt: "2026-03-08T08:00:00.000Z",
    iconLabel: "BL",
    accent: "from-cyan-300/26 via-blue-500/18 to-indigo-500/22",
    glow: "shadow-[0_18px_40px_rgba(59,130,246,0.18)]",
    description: "Une fiche courte, rapide et tactile pour garder l'energie mobile-first jusque dans la navigation secondaire.",
    ctaLabel: "Acceder",
    currencyLabel: "tokens",
    purchaseHighlights: ["Offre populaire", "Achat tactile", "Texte lisible"],
  },
  {
    slug: "solo-leveling-arise",
    title: "Solo Leveling",
    subtitle: "Shadow rush",
    genre: "Action anime",
    image: "/games/phantom-grid.svg",
    createdAt: "2026-03-11T08:00:00.000Z",
    iconLabel: "SL",
    accent: "from-violet-400/28 via-indigo-500/18 to-slate-300/18",
    glow: "shadow-[0_18px_40px_rgba(129,140,248,0.2)]",
    description: "Une mise en avant sobre et premium, plus proche d'un ecran d'accueil mobile que d'une marketplace dense.",
    ctaLabel: "Consulter",
    currencyLabel: "essences",
    purchaseHighlights: ["Presentation propre", "CTA direct", "Description utile"],
  },
  {
    slug: "pokemon-unite",
    title: "Unite",
    subtitle: "MOBA rapide",
    genre: "Arena mobile",
    image: "/games/redline-reborn.svg",
    createdAt: "2026-03-14T08:00:00.000Z",
    iconLabel: "PU",
    accent: "from-amber-300/26 via-orange-400/18 to-fuchsia-500/18",
    glow: "shadow-[0_18px_40px_rgba(245,158,11,0.18)]",
    description: "Chaque bloc se comporte comme une app: petite carte, clic complet, lecture instantanee et hierarchie visuelle simple.",
    ctaLabel: "Ouvrir",
    currencyLabel: "gems",
    purchaseHighlights: ["Liste verticale claire", "Carte moderne", "Conversion priorisee"],
  },
  {
    slug: "nikke",
    title: "Nikke",
    subtitle: "Squad anime",
    genre: "Shooter RPG",
    image: "/games/titan-protocol.svg",
    createdAt: "2026-03-17T08:00:00.000Z",
    iconLabel: "NK",
    accent: "from-rose-400/24 via-fuchsia-500/18 to-violet-500/24",
    glow: "shadow-[0_18px_40px_rgba(217,70,239,0.18)]",
    description: "Le rendu reste futuriste et premium, avec moins d'encombrement visuel pour donner envie de cliquer sur chaque offre.",
    ctaLabel: "Afficher la page",
    currencyLabel: "jewels",
    purchaseHighlights: ["UX claire", "Offres valorisees", "Parcours oriente achat"],
  },
];

export const gameApps: GameApp[] = gameSeeds.map((game) => ({
  ...game,
  topUpOptions: createTopUpOptions(game.currencyLabel),
  descriptionSections: createDescriptionSections(game.title, game.currencyLabel),
}));

export function getGameApp(slug: string) {
  return gameApps.find((game) => game.slug === slug);
}