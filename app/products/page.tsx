export const metadata = {
  title: "Shop Products | GR Shop",
  description: "Browse our latest products and exclusive offers on GR Shop.",
  alternates: {
    canonical: "https://gr-shop-2.vercel.app/products",
  },
  openGraph: {
    title: "Shop Products | GR Shop",
    description: "Browse our latest products and exclusive offers on GR Shop.",
    url: "https://gr-shop-2.vercel.app/products",
    siteName: "GR Shop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Products | GR Shop",
    description: "Browse our latest products and exclusive offers on GR Shop.",
    // image: "https://gr-shop-2.vercel.app/your-image.png",
  },
};

import { Suspense } from "react";
import ProductsClient from "@/components/products/ProductsClient";

export default function ProductsPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsClient />
      </Suspense>
    </div>
  );
}
