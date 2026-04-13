"use client";

import { useGlobalNotifications } from "@/components/notifications/NotificationsProvider";
import { Bell, Headset, House, MessageCircleMore, ShoppingCart, UserCircle2, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";

const navItems = [
  {
    key: "home",
    href: "/",
    Icon: House,
  },
  {
    key: "account",
    href: "/login",
    Icon: UserCircle2,
  },
  {
    key: "notifications",
    href: "/notifications",
    Icon: Bell,
  },
  {
    key: "support",
    Icon: Headset,
  },
  {
    key: "cart",
    href: "/cart",
    Icon: ShoppingCart,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const { hasUnread } = useGlobalNotifications();

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <>
      {isSupportOpen ? (
        <div className="fixed inset-0 z-[60] bg-slate-950/48 sm:hidden" onClick={() => setIsSupportOpen(false)}>
          <div className="absolute inset-x-4 bottom-24 rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(11,15,26,0.96),rgba(9,13,22,0.98))] p-4 shadow-[0_24px_44px_rgba(3,6,16,0.32)] backdrop-blur-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/72">Support</p>
                <h3 className="mt-1 text-base font-semibold text-white">WhatsApp Business</h3>
              </div>
              <button
                type="button"
                aria-label="Fermer la fenetre support"
                onClick={() => setIsSupportOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/76"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="mt-4 rounded-[1.35rem] border border-emerald-300/16 bg-emerald-400/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_22px_rgba(34,197,94,0.28)]">
                  <MessageCircleMore className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Support WhatsApp Business</p>
                  <p className="mt-1 text-xs leading-5 text-white/58">Assistance rapide pour vos questions et commandes.</p>
                </div>
              </div>

              <a
                href="https://wa.me/90572457"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(37,211,102,0.22)] transition active:scale-[0.98]"
              >
                Contacter le support
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] w-full sm:hidden">
        <nav
          aria-label="Navigation mobile"
          className="pointer-events-auto w-full rounded-t-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(11,15,26,0.86),rgba(9,13,22,0.94))] p-1 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] shadow-[0_10px_24px_rgba(3,6,16,0.2)] backdrop-blur-xl"
        >
          <div className="grid grid-cols-5 gap-0.5">
            {navItems.map(({ key, href, Icon }) => {
              const isActive = key === "support" ? isSupportOpen : pathname === href;

              if (key === "support") {
                return (
                  <button
                    key={key}
                    type="button"
                    aria-label="Ouvrir le support"
                    onClick={() => setIsSupportOpen(true)}
                    className={`relative flex min-h-11 items-center justify-center rounded-[0.95rem] px-2 py-1 transition active:scale-[0.98] ${
                      isActive
                        ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        : "text-white/58 hover:bg-white/6 hover:text-white/88"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-emerald-300" : "text-white/72"}`} />
                  </button>
                );
              }

              return (
                <Link
                  key={key}
                  href={href!}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex min-h-11 items-center justify-center rounded-[0.95rem] px-2 py-1 transition active:scale-[0.98] ${
                    isActive
                      ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                      : "text-white/58 hover:bg-white/6 hover:text-white/88"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-cyan-200" : "text-white/72"}`} />
                  {key === "notifications" && hasUnread ? (
                    <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.45)]" />
                  ) : null}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>,
    document.body,
  );
}