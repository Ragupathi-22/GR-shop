"use client";

import { useEffect, useState } from "react";
import HeroBanner from "./HeroBanner";
import CategoryGrid from "./CategoryGrid";
import FeaturedProducts from "./FeaturedProducts";
import { wooCommerceAPI } from "@/services/api";

export default function HomeContent() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([wooCommerceAPI.getFeaturedProducts(), wooCommerceAPI.getCategories()])
      .then(([productsData, categoriesData]) => {
        setFeaturedProducts(productsData);
        setCategories(categoriesData);
      })
      .catch((err) => console.error("Error fetching homepage data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <HeroBanner />

      <div className="container mx-auto px-4 py-12">
        {/* Categories Section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Shop by Category
          </h2>

          {loading && categories.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <CategoryGrid categories={categories} />
          )}
        </div>

        {/* Featured Products Section */}
        {loading && featuredProducts.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <FeaturedProducts products={featuredProducts} />
        )}

        {/* Promotion Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-8 md:p-12 md:w-1/2">
              <h2 className="text-3xl font-bold text-white mb-4">Summer Sale</h2>
              <p className="text-blue-100 mb-6">
                Get up to 40% off on selected smartphones and accessories.
                Limited time offer!
              </p>
              <button className="bg-white text-blue-600 font-medium px-6 py-3 rounded-md hover:bg-blue-50 transition-colors duration-300">
                Shop Now
              </button>
            </div>
            <div className="md:w-1/2 p-8 md:p-0">
              <img
                src="https://images.unsplash.com/photo-1551649668-fe71bdc4bd76?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                alt="Summer Sale"
                className="w-full h-auto rounded-lg md:rounded-l-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
