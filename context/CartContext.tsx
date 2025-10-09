"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { useGlobalLoading } from "./GlobalLoadingContext";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  attributes?: {
    color?: string;
    size?: string;
  };
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number, attributes?: object) => void;
  updateQuantity: (productId: number, quantity: number, attributes?: object) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  loading: boolean;      // initial cart fetch
  cartLoading: boolean;  // for any cart action
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const { setGlobalLoading: setGlobalLoading } = useGlobalLoading();
  

  // Fetch cart from server on mount or user change
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCart([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        setGlobalLoading(true);
        const res = await fetch("/api/cart", { method: "GET", credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setCart(data.cart || []);
        } else {
          setCart([]);
        }
      } catch (err) {
        console.error("Failed to fetch cart", err);
        setCart([]);
      } finally {
        setLoading(false);
        setGlobalLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  const addToCart = async (product: CartItem) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    const userEmail = user.email;
    setCartLoading(true);
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          quantity: product.quantity,
          name: product.name,
          userEmail: userEmail,
        })

      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add to cart");
      }
      const data = await res.json();
      setCart(data.cart);
      toast.success(`Added ${product.name} to cart`);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCart = async (productId: number, attributes?: object) => {
    if (!user) return;
    setCartLoading(true);
    try {
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, attributes }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
        toast.info("Item removed from cart");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    } finally {
      setCartLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number, attributes?: object) => {
    if (!user) return;
    setCartLoading(true);
    try {
      const res = await fetch("/api/cart/update", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, attributes }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity");
    } finally {
      setCartLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    setCartLoading(true);
    try {
      const res = await fetch("/api/cart/clear", { method: "POST", credentials: "include" });
      if (res.ok) {
        setCart([]);
        toast.info("Cart cleared");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear cart");
    } finally {
      setCartLoading(false);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        loading,
        cartLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
