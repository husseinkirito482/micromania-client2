import type { Metadata } from "next";
import { CartAnimationLayer } from "@/components/cart/CartAnimationLayer";
import { CartProvider } from "@/components/cart/CartProvider";
import { GlobalCartButton } from "@/components/cart/GlobalCartButton";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { NotificationsProvider } from "@/components/notifications/NotificationsProvider";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nova Arena | Gaming Storefront",
  description:
    "Premium gaming storefront concept built with Next.js, Tailwind CSS, and Framer Motion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NotificationsProvider>
          <CartProvider>
            <GlobalCartButton />
            <CartAnimationLayer />
            <PageTransition>{children}</PageTransition>
            <Footer />
          </CartProvider>
        </NotificationsProvider>
      </body>
    </html>
  );
}
