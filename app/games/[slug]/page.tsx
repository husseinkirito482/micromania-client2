import { GameDetailView } from "./GameDetailView";

type GameDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { slug } = await params;

  return <GameDetailView slug={slug} />;
}