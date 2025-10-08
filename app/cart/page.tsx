"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCartIcon, ArrowLeftIcon, TrashIcon } from "lucide-react";
import CartItem from "@/components/cart/CartItem";
import { useCart } from "@/context/CartContext";

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartLoading
  } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  // const handleCheckout = async () => {  
  //   if (cartLoading) return;
  //   try {
  //     setCheckoutLoading(true);
  //     const res = await fetch("/api/checkout/create-order", {
  //       method: "POST",
  //       credentials: "include",
  //     });
  //     const data = await res.json();
  //     if (data.success && data.checkoutUrl) {
  //       window.location.href = data.checkoutUrl;
  //     } else {
  //       alert("Failed to create order");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert("Something went wrong during checkout");
  //   }
  //   finally{
  //     setCheckoutLoading(false);
  //   }
  // };



  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-800">
                    Shopping Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)
                  </h2>
                  <button
                    onClick={clearCart}
                    disabled={cartLoading}
                    className={`text-red-600 hover:text-red-800 flex items-center text-sm font-medium ${cartLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    {cartLoading ? "Processing..." : "Clear Cart"}
                  </button>
                </div>

                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}

                <div className="p-6 border-t border-gray-200">
                  <Link
                    href="/products"
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-800">Order Summary</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center transition-colors mt-6 ${cartLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
                      }`}
                    aria-disabled={cartLoading}
                  >
                    Proceed to Checkout
                  </Link>

                  <div className="mt-4 text-sm text-gray-500 text-center">
                    <p>Secure checkout powered by WooCommerce</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingCartIcon className="h-16 w-16 text-gray-300" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
