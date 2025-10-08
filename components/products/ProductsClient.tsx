"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GridIcon, ListIcon } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import { wooCommerceAPI, Product, Category } from "@/services/api";

const ProductsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState(searchParams?.get("sort") || "default");

  const filters = {
    category: searchParams?.get("category") || undefined,
    search: searchParams?.get("search") || undefined,
    min_price: searchParams?.get("min_price") || undefined,
    max_price: searchParams?.get("max_price") || undefined,
    in_stock: searchParams?.get("in_stock") || undefined,
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSort(value);

    handleFilterChange({
      ...filters,
      sort: value
    });
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    });
    router.replace(`/products?${params.toString()}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const categoriesData = await wooCommerceAPI.getCategories();
        setCategories(categoriesData);

        // Fetch products
        let productsData = await wooCommerceAPI.getProducts(filters);

        // Apply sort locally
        if (sort === "price-low-high") {
          productsData.sort(
            (a, b) => (a.sale_price || a.regular_price) - (b.sale_price || b.regular_price)
          );
        } else if (sort === "price-high-low") {
          productsData.sort(
            (a, b) => (b.sale_price || b.regular_price) - (a.sale_price || a.regular_price)
          );
        }

        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching products data:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [
    filters.category,
    filters.search,
    filters.min_price,
    filters.max_price,
    filters.in_stock,
    sort,
  ]);

  const getCategoryName = () => {
    if (filters.category) {
      const category = categories.find(
        (c) => c.id.toString() === filters.category || c.slug === filters.category
      );
      return category ? category.name : "Products";
    }
    return "All Products";
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <h3 className="text-3xl font-bold text-gray-800">{getCategoryName()}</h3>
          {filters.search && (
            <p className="text-gray-600 mt-2">
              Search results for:{" "}
              <span className="font-medium">"{filters.search}"</span>
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <ProductFilters
              categories={categories}
              activeFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Products Grid/List */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex justify-between items-center">
              <div className="text-gray-600">
                {!loading && (
                  <>
                    Showing <span className="font-medium">{products.length}</span>{" "}
                    products
                  </>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1 rounded ${
                      viewMode === "grid" ? "bg-gray-200 text-gray-800" : "text-gray-400"
                    }`}
                  >
                    <GridIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1 rounded ${
                      viewMode === "list" ? "bg-gray-200 text-gray-800" : "text-gray-400"
                    }`}
                  >
                    <ListIcon className="h-5 w-5" />
                  </button>
                </div>

                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="form-select border border-gray-300 rounded-md text-sm py-2 pl-3 pr-8"
                  aria-label="Sort products"
                >
                  <option value="default">Sort by: Default</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Container */}
            <div className="bg-white rounded-lg shadow-sm p-4 max-h-[75vh] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <h3 className="text-xl font-medium text-red-600 mb-2">{error}</h3>
                  <button
                    onClick={() => handleFilterChange({})}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors mt-4"
                  >
                    Clear All Filters and Try Again
                  </button>
                </div>
              ) : products.length > 0 ? (
                <div
                  className={`grid ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  } gap-6`}
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search term.
                  </p>
                  <button
                    onClick={() => handleFilterChange({})}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
