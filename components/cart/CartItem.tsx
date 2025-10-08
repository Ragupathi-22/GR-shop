"use client";
import React from "react";
import Link from "next/link";
import { XIcon, PlusIcon, MinusIcon } from "lucide-react";
import { CartItem as CartItemType } from "@/context/CartContext";

type CartItemProps = {
  item: CartItemType;
  onRemove: (id: number, attributes?: object) => void;
  onUpdateQuantity: (id: number, quantity: number, attributes?: object) => void;
};

const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onUpdateQuantity,
}) => {
  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-gray-200">
      {/* Product Image */}
      <div className="w-full sm:w-24 h-24 sm:mr-6 mb-4 sm:mb-0 flex-shrink-0">
        <Link href={`/products/${item.id}`}>
          <img
            src={item.image || "https://via.placeholder.com/100"}
            alt={item.name}
            className="w-full h-full object-cover rounded-md"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex-grow flex flex-col sm:flex-row">
        <div className="flex-grow">
          <Link
            href={`/products/${item.id}`}
            className="text-lg font-medium text-gray-800 hover:text-blue-600"
          >
            {item.name}
          </Link>

          {/* Product Attributes (if any) */}
          {item.attributes && Object.keys(item.attributes).length > 0 && (
            <div className="mt-1 text-sm text-gray-600">
              {Object.entries(item.attributes).map(
                ([key, value]) =>
                  value && (
                    <span key={key} className="mr-4">
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                    </span>
                  )
              )}
            </div>
          )}

          {/* Mobile Price */}
          <div className="sm:hidden mt-2 text-lg font-bold text-gray-800">
            ${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 sm:mt-0">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.attributes)}
              disabled={item.quantity <= 1}
              className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 text-gray-800 text-center w-10">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.attributes)}
              className="px-2 py-1 text-gray-600 hover:text-gray-800"
              aria-label="Increase quantity"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Desktop Price */}
          <div className="hidden sm:block text-lg font-bold text-gray-800 ml-8 w-24 text-right">
            ${(item.price * item.quantity).toFixed(2)}
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(item.id, item.attributes)}
            className="ml-4 text-gray-400 hover:text-red-600"
            aria-label="Remove item"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
