"use client";

import { useGlobalNotifications } from "@/components/notifications/NotificationsProvider";
import { Bell, ChevronLeft, MessageCircleMore } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function NotificationsPage() {
  const { isLoading, items, markAllAsRead, unreadCount } = useGlobalNotifications();

  useEffect(() => {
    if (!isLoading && items.length > 0) {
      markAllAsRead();
    }
  }, [isLoading, items.length, markAllAsRead]);

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--foreground)] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Retour accueil"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/82 backdrop-blur-md transition duration-150 hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-cyan-300/14 bg-white/6 px-3 py-1.5 text-sm text-white/78 backdrop-blur-md">
            <Bell className="h-4 w-4 text-cyan-200" />
            <span>Notifications</span>
          </div>
        </div>

        <section className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,19,34,0.88),rgba(8,12,22,0.98))] p-4 shadow-[0_16px_38px_rgba(3,6,16,0.28)] backdrop-blur-xl sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-[family-name:var(--font-orbitron)] text-2xl font-bold uppercase tracking-[0.08em] text-white">
                Centre de notifications
              </h1>
              <p className="mt-2 text-sm leading-6 text-white/62">
                Restez informe des nouveaux messages admin, offres utiles et mises a jour de votre boutique.
              </p>
            </div>

            <div className="rounded-full border border-rose-400/18 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-rose-100/82">
              {unreadCount > 0 ? `${unreadCount} nouveau${unreadCount > 1 ? "x" : ""}` : "A jour"}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {!isLoading && items.length > 0 ? (
              items.map((notification) => (
                <article
                  key={notification.id}
                  className="rounded-[1.25rem] border border-white/8 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-300/16 bg-emerald-400/10 text-emerald-200 shadow-[0_0_18px_rgba(74,222,128,0.14)]">
                      <MessageCircleMore className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-white sm:text-base">{notification.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-white/60">{notification.message}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-white/36">
                        {new Date(notification.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            ) : isLoading ? (
              <div className="rounded-[1.35rem] border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/72">
                  <Bell className="h-4.5 w-4.5 animate-pulse" />
                </div>
                <p className="mt-4 text-sm font-semibold text-white">Chargement des notifications</p>
                <p className="mt-2 text-sm leading-6 text-white/56">
                  Recuperation des messages envoyes par l&apos;administration.
                </p>
              </div>
            ) : (
              <div className="rounded-[1.35rem] border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/72">
                  <Bell className="h-4.5 w-4.5" />
                </div>
                <p className="mt-4 text-sm font-semibold text-white">Aucune notification</p>
                <p className="mt-2 text-sm leading-6 text-white/56">
                  Rien a afficher pour le moment. Vos prochaines alertes apparaitront ici.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}