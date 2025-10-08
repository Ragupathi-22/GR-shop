// components/home/HeroBanner.tsx
import Link from "next/link";

export default function HeroBanner() {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
          alt="Latest tech gadgets"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Next-Gen Tech at Your Fingertips
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Discover the latest smartphones, laptops, and accessories with
            exclusive deals and premium service.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-md text-center transition-colors duration-300"
            >
              Shop Now
            </Link>

            <Link
              href="/products?category=new-arrivals"
              className="inline-block bg-transparent hover:bg-white/10 text-white border border-white font-medium px-8 py-3 rounded-md text-center transition-colors duration-300"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
