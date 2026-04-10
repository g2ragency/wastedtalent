"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface CartItem {
  id: number;
  variationId?: number;
  name: string;
  price: string;
  quantity: number;
  image?: string;
  slug: string;
  size?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, suppressDrawer?: boolean) => void;
  removeItem: (id: number, variationId?: number) => void;
  updateQuantity: (id: number, quantity: number, variationId?: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error loading cart:", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (
    item: Omit<CartItem, "quantity">,
    suppressDrawer?: boolean,
  ) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (i) => i.id === item.id && (i.variationId || 0) === (item.variationId || 0),
      );

      if (existingItem) {
        return currentItems.map((i) =>
          i.id === item.id && (i.variationId || 0) === (item.variationId || 0)
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }

      return [...currentItems, { ...item, quantity: 1 }];
    });
    if (!suppressDrawer) {
      openDrawer();
    }
  };

  const removeItem = (id: number, variationId?: number) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(item.id === id && (item.variationId || 0) === (variationId || 0)),
      ),
    );
  };

  const updateQuantity = (
    id: number,
    quantity: number,
    variationId?: number,
  ) => {
    if (quantity <= 0) {
      removeItem(id, variationId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id && (item.variationId || 0) === (variationId || 0)
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
