"use client";

import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, HeartIcon, TruckIcon, ShieldCheckIcon, StarIcon } from "lucide-react";
import { wooCommerceAPI, Product } from "@/services/api";
import { useCart } from "@/context/CartContext";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import SEOHead from "@/components/SEOHead";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ params }) => {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const productData = await wooCommerceAPI.getProduct(Number(id));
        if (productData) {
          setProduct(productData);
          setSelectedImage(productData.images[0]?.src || "");

          // Initialize selected attributes
          const initialAttributes: Record<string, string> = {};
          productData.attributes.forEach(attr => {
            if (attr.options.length > 0) {
              initialAttributes[attr.name.toLowerCase()] = attr.options[0];
            }
          });
          setSelectedAttributes(initialAttributes);

          // Fetch related products
          const related = await wooCommerceAPI.getProducts({
            category: productData.categories[0]?.id
          });
          setRelatedProducts(related.filter(p => p.id !== productData.id).slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleAttributeChange = (name: string, value: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [name.toLowerCase()]: value
    }));
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.sale_price || product.regular_price,
        image: product.images[0]?.src || "",
        quantity,
        attributes: selectedAttributes
      });
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
        <p className="text-gray-600 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">


      {product && (
        <SEOHead
          title={`${product.name} | My Shop`}
          description={product.short_description || "Shop the latest products at great prices."}
          image={product.images?.[0]?.src}
          url={`https://gr-shop-2.vercel.app/products/${product.id}`}
          keywords={`${product.name}, ${product.categories?.[0]?.name}, buy ${product.name}`}
          type="product"
          schema={{
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: product.images?.map((img) => img.src),
            description: product.short_description || product.description,
            sku: `sku-${product.id}`,
            brand: {
              "@type": "Brand",
              name: product.categories?.[0]?.name || "My Shop",
            },
            offers: {
              "@type": "Offer",
              url: `https://gr-shop-2.vercel.app/products/${product.id}`,
              priceCurrency: "USD",
              price: product.sale_price || product.regular_price,
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.5",
              reviewCount: "42",
            },
          }}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-blue-600">Home</Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-blue-600">Products</Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link
                href={`/products?category=${product.categories[0]?.id}`}
                className="text-gray-500 hover:text-blue-600"
              >
                {product.categories[0]?.name}
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-800 font-medium truncate">{product.name}</li>
          </ol>
        </nav>

        {/* Product Detail */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 p-6">
            {/* Product Images */}
            <div>
              <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 flex justify-center items-center max-h-[450px]">
                <Image
                  src={selectedImage || product.images[0]?.src}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto mt-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img.src)}
                      className={`w-20 h-20 flex-shrink-0 rounded border-2 overflow-hidden ${selectedImage === img.src ? "border-blue-600" : "border-gray-200"
                        }`}
                    >
                      <Image
                        src={img.src}
                        alt={`${product.name} thumbnail ${idx}`}
                        width={80}
                        height={80}
                        className="object-contain w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(4)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5" fill="currentColor" />
                  ))}
                  <StarIcon className="h-5 w-5 text-gray-300" fill="currentColor" />
                </div>
                <span className="text-gray-600 text-sm">42 reviews</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                {product.on_sale ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-gray-800">${product.sale_price}</span>
                    <span className="text-xl text-gray-500 line-through">${product.regular_price}</span>
                    <span className="ml-3 bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded">
                      Save ${(product.regular_price - product.sale_price).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-800">${product.regular_price}</span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-gray-600 mb-6">{product.short_description}</p>

              {/* Attributes */}
              {product.attributes.map(attribute => (
                <div key={attribute.id} className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">{attribute.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {attribute.options.map(option => (
                      <button
                        key={option}
                        onClick={() => handleAttributeChange(attribute.name, option)}
                        className={`px-3 py-1 border rounded-md text-sm ${selectedAttributes[attribute.name.toLowerCase()] === option
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Quantity</h3>
                <div className="flex items-center w-fit border rounded-md overflow-hidden">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-l border-r border-gray-300 text-gray-700"
                  />
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="p-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {addingToCart && (
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
                  )}
                  Add to Cart
                </button>
                <button className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-md font-medium flex items-center justify-center transition-colors">
                  <HeartIcon className="h-5 w-5 mr-2" />
                  Wishlist
                </button>
              </div>

              {/* Shipping & Returns */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <TruckIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Free Shipping</h4>
                    <p className="text-sm text-gray-600">Free standard shipping on orders over $99</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">30-Day Returns</h4>
                    <p className="text-sm text-gray-600">Shop with confidence with our 30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Product Description</h2>
            <div
              className="prose max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <FeaturedProducts products={relatedProducts} title="You May Also Like" category={product.categories[0]?.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
