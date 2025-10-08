"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCartIcon, HeartIcon } from "lucide-react";
import { Product } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

type ProductCardProps = {
  product: Product;
  viewMode?: "grid" | "list"; // Add viewMode prop
};

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addToCart } = useCart();
  const [loadingMap, setLoadingMap] = useState<{ [key: number]: boolean }>({});

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoadingMap((prev) => ({ ...prev, [product.id]: true }));
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.sale_price || product.regular_price,
        image: product.images[0]?.src || "",
        quantity: 1,
      });
    } finally {
      setLoadingMap((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const isLoading = !!loadingMap[product.id];

  return (
    <Link
      href={`/products/${product.id}`}
      className={`group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
        viewMode === "grid" ? "flex flex-col max-w-[220px]" : "flex flex-row gap-4 p-4"
      }`}
    >
      {/* Image */}
      <div
        className={`relative bg-gray-100 flex items-center justify-center ${
          viewMode === "grid"
            ? "w-full h-52 p-2"
            : "w-40 h-40 flex-shrink-0 rounded-md overflow-hidden"
        }`}
      >
        <Image
          src={product.images[0]?.src || "https://via.placeholder.com/300"}
          alt={product.name}
          width={400}
          height={400}
          className={`object-cover w-full h-full transition-transform duration-300 group-hover:scale-105`}
        />
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200">
          <HeartIcon className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Details */}
      <div className={`flex flex-col gap-1.5 ${viewMode === "list" ? "flex-1" : "p-3"}`}>
        {/* Product Name */}
        <p className="font-medium text-gray-800 text-sm md:text-base truncate">{product.name}</p>

        {/* Description */}
        {viewMode === "list" && product.description && (
          <div
            className="text-gray-500 text-xs line-clamp-3 mt-1"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <p className="text-xs text-gray-600">{product.rating || 4.5}</p>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <img
                key={index}
                src={index < Math.floor(product.rating || 4) ? "/star_icon.svg" : "/star_dull_icon.svg"}
                alt="star"
                className="w-3 h-3"
              />
            ))}
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-2">
          <p className="font-bold text-gray-800 text-sm md:text-base">
            ${product.sale_price || product.regular_price}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white text-xs rounded-full transition-colors duration-200 ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-4 w-4 mr-1 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 10-8 8h4z"
                ></path>
              </svg>
            ) : (
              <ShoppingCartIcon className="h-4 w-4 mr-1" />
            )}
            {isLoading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}
