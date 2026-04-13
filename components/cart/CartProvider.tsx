"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

const CART_STORAGE_KEY = "nova-arena-cart";
const CART_ANCHOR_ID = "global-cart-anchor";

type CartAnimationItem = {
  id: string;
  image: string;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
};

export type CartProductInput = Omit<CartItem, "quantity">;

type CartContextValue = {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
  isReady: boolean;
  cartPulseToken: number;
  animationItems: CartAnimationItem[];
  addItem: (product: CartProductInput, sourceRect?: DOMRect | null) => void;
  completeAnimation: (id: string) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, direction: "increment" | "decrement") => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function parseCartPrice(value: string) {
  const normalizedValue = value
    .replace(/EUR/gi, "")
    .replace(/€/g, "")
    .replace(/\s+/g, "")
    .replace(/,(?=\d{2}$)/, ".");

  const parsedValue = Number.parseFloat(normalizedValue);

  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

export function formatCartPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [animationItems, setAnimationItems] = useState<CartAnimationItem[]>([]);
  const [cartPulseToken, setCartPulseToken] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

      if (storedCart) {
        const parsedCart = JSON.parse(storedCart) as CartItem[];
        setItems(Array.isArray(parsedCart) ? parsedCart : []);
      }
    } catch {
      setItems([]);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isReady]);

  const totalAmount = useMemo(
    () => items.reduce((runningTotal, item) => runningTotal + item.price * item.quantity, 0),
    [items],
  );

  const totalQuantity = useMemo(
    () => items.reduce((runningTotal, item) => runningTotal + item.quantity, 0),
    [items],
  );

  const createAnimation = (product: CartProductInput, sourceRect?: DOMRect | null) => {
    if (!sourceRect) {
      return;
    }

    const cartAnchor = document.getElementById(CART_ANCHOR_ID);

    if (!cartAnchor) {
      return;
    }

    const targetRect = cartAnchor.getBoundingClientRect();
    const animationId = `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const startX = sourceRect.left + sourceRect.width / 2;
    const startY = sourceRect.top + sourceRect.height / 2;
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    setAnimationItems((currentItems) => [
      ...currentItems,
      {
        id: animationId,
        image: product.image,
        startX,
        startY,
        deltaX: targetX - startX,
        deltaY: targetY - startY,
      },
    ]);
  };

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalAmount,
      totalQuantity,
      isReady,
      cartPulseToken,
      animationItems,
      addItem: (product, sourceRect) => {
        setItems((currentItems) => {
          const existingItem = currentItems.find((item) => item.id === product.id);

          if (existingItem) {
            return currentItems.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
            );
          }

          return [...currentItems, { ...product, quantity: 1 }];
        });

        createAnimation(product, sourceRect);
      },
      completeAnimation: (id) => {
        setAnimationItems((currentItems) => currentItems.filter((item) => item.id !== id));
        setCartPulseToken((currentToken) => currentToken + 1);
      },
      removeItem: (id) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== id));
      },
      updateItemQuantity: (id, direction) => {
        setItems((currentItems) =>
          currentItems.flatMap((item) => {
            if (item.id !== id) {
              return item;
            }

            if (direction === "decrement") {
              if (item.quantity <= 1) {
                return [];
              }

              return [{ ...item, quantity: item.quantity - 1 }];
            }

            return [{ ...item, quantity: item.quantity + 1 }];
          }),
        );
      },
      clearCart: () => {
        setItems([]);
      },
    }),
    [animationItems, cartPulseToken, isReady, items, totalAmount, totalQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}