import { PremiumBanner } from "@/components/home/PremiumBanner";
import { HomeRecentSections } from "@/components/home/HomeRecentSections";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />
      <main className="flex-1 pb-24 sm:pb-0">
        <PremiumBanner />
        <HomeRecentSections />
      </main>
      <MobileBottomNav />
    </div>
  );
}
