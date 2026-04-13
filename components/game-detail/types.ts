export type TopUpOption = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  ctaLabel: string;
  badge?: string;
};

export type TopUpDescriptionSection = {
  title: string;
  body: string;
};

export type TopUpProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  genre: string;
  description: string;
  image: string;
  images: string[];
  accent: string;
  glow: string;
  ctaLabel: string;
  purchaseHighlights: string[];
  topUpOptions: TopUpOption[];
  descriptionSections: TopUpDescriptionSection[];
  createdAt: string;
};

export type CatalogPayload = {
  catalog: {
    topups: Array<{
      id: string;
      slug: string;
      title: string;
      subtitle: string;
      genre: string;
      description: string;
      image: string;
      images: string[];
      accent: string;
      glow: string;
      ctaLabel: string;
      purchaseHighlights: string[];
      prices: Array<{
        id: string;
        label: string;
        subtitle?: string;
        price: string;
        badge?: string;
      }>;
      descriptionSections: TopUpDescriptionSection[];
      createdAt: string;
    }>;
  };
};