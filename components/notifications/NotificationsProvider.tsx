"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type GlobalNotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
};

type NotificationResponse = {
  items: GlobalNotificationItem[];
};

type NotificationsContextValue = {
  isLoading: boolean;
  items: GlobalNotificationItem[];
  unreadCount: number;
  hasUnread: boolean;
  markAllAsRead: () => void;
  refresh: () => Promise<void>;
};

const LAST_SEEN_STORAGE_KEY = "nova.notifications.last-seen";
const REFRESH_INTERVAL_MS = 60_000;

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function readLastSeenValue() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(LAST_SEEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeLastSeenValue(value: string) {
  try {
    window.localStorage.setItem(LAST_SEEN_STORAGE_KEY, value);
  } catch {
    return;
  }
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<GlobalNotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(() => readLastSeenValue());

  const refresh = useCallback(async () => {
    const response = await fetch("/api/public/notifications?page=1", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Impossible de charger les notifications");
    }

    const payload = (await response.json()) as NotificationResponse;
    setItems(payload.items ?? []);
  }, []);

  useEffect(() => {
    const initialLoadId = window.setTimeout(() => {
      refresh()
        .catch(() => undefined)
        .finally(() => setIsLoading(false));
    }, 0);

    const intervalId = window.setInterval(() => {
      refresh().catch(() => undefined);
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearTimeout(initialLoadId);
      window.clearInterval(intervalId);
    };
  }, [refresh]);

  const unreadCount = useMemo(() => {
    if (!lastSeenAt) {
      return items.length;
    }

    const lastSeenTime = new Date(lastSeenAt).getTime();
    return items.filter((item) => new Date(item.createdAt).getTime() > lastSeenTime).length;
  }, [items, lastSeenAt]);

  const markAllAsRead = useCallback(() => {
    const newestTimestamp = items[0]?.createdAt ?? new Date().toISOString();
    setLastSeenAt(newestTimestamp);
    writeLastSeenValue(newestTimestamp);
  }, [items]);

  const value = useMemo(
    () => ({
      isLoading,
      items,
      unreadCount,
      hasUnread: unreadCount > 0,
      markAllAsRead,
      refresh,
    }),
    [isLoading, items, unreadCount, markAllAsRead, refresh],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useGlobalNotifications() {
  const value = useContext(NotificationsContext);

  if (!value) {
    throw new Error("useGlobalNotifications must be used within NotificationsProvider");
  }

  return value;
}