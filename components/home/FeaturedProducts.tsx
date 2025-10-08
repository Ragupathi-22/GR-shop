import Link from "next/link";
import { Product } from "@/services/api";
import ProductCard from "@/components/products/ProductCard";

type FeaturedProductsProps = {
  products: Product[];
  title?: string;
  category?: number;
};

export default function FeaturedProducts({
  products,
  title = "Featured Products",
  category,
}: FeaturedProductsProps) {
  return (
    <section className="my-12 px-4 md:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          {title}
        </h2>
        <Link
          href={category ? `/products?category=${category}` : "/products"}
          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center transition-all duration-200"
        >
          View All
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-1 transform transition-transform duration-200 group-hover:translate-x-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Optional Background Decoration */}
      <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none"></div>
    </section>
  );
}
