"use client";

import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { usePathname } from "next/navigation";

const customerServiceLinks = [
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Suivi de commande", href: "/tracking" },
];

const shopLinks = [
  { label: "Gaming", href: "/games" },
  { label: "Boutique", href: "/shop" },
  { label: "Cartes cadeaux", href: "/gift-cards" },
  
];

const infoLinks = [
  { label: "Livraison", href: "/shipping" },
  { label: "Conditions generales", href: "/terms" },
  { label: "Politique de confidentialite", href: "/privacy" },
];

const paymentMethods = ["Visa", "Mastercard", "PayPal", "Paiement mobile"];

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#", mark: "FB" },
  { label: "X", href: "#", mark: "X" },
  { label: "TikTok", href: "#", mark: "TT" },
];

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/92">{title}</h3>
      {children}
    </div>
  );
}

function FooterLinks({ links }: { links: Array<{ label: string; href: string }> }) {
  return (
    <ul className="space-y-2.5 text-sm text-white/72">
      {links.map((link) => (
        <li key={link.label}>
          <Link href={link.href} className="transition duration-150 hover:text-white">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-12 hidden rounded-t-[2rem] bg-[linear-gradient(180deg,#10,#10)] text-white shadow-[0_-12px_40px_rgba(15,23,42,0.24)] sm:mt-16 sm:block sm:rounded-t-[2.75rem]">
      <Container className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.15fr_0.8fr_0.9fr_0.8fr_0.95fr_0.95fr]">
          <div className="space-y-6">
            <FooterColumn title="">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14 text-lg font-black tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    NS
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-orbitron)] text-lg tracking-[0.18em] text-white">
                      SILVESTRE Shop
                    </p>
                    
                  </div>
                </div>

                <p className="max-w-md text-sm leading-6 text-white/76">
                
                </p>
              </div>
            </FooterColumn>
          </div>

          <FooterColumn title="Service client">
            <FooterLinks links={customerServiceLinks} />
          </FooterColumn>

          <FooterColumn title="Boutique">
            <FooterLinks links={shopLinks} />
          </FooterColumn>

          <FooterColumn title="Paiement">
            <div className="flex flex-wrap gap-2.5 text-sm text-white/82">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="rounded-full border border-white/16 bg-white/8 px-3 py-2 transition duration-150 hover:bg-white/12"
                >
                  {method}
                </span>
              ))}
            </div>
          </FooterColumn>

          <FooterColumn title="Informations">
            <FooterLinks links={infoLinks} />
          </FooterColumn>

          <FooterColumn title="Reseaux sociaux">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
              {socialLinks.map(({ label, href, mark }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-2 rounded-2xl border border-white/14 bg-white/8 px-3 py-3 text-sm text-white/80 transition duration-150 hover:bg-white/14 hover:text-white"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/14 text-[10px] font-bold tracking-[0.12em] text-white">
                    {mark}
                  </span>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </FooterColumn>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/12 pt-5 text-sm text-white/68 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Nova Store. Tous droits reserves.</p>
          <p>Paiement securise et informations claires pour vos commandes.</p>
        </div>
      </Container>
    </footer>
  );
}