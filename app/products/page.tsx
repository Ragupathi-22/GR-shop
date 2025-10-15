import Head from "next/head";
import { Suspense } from "react";
import ProductsClient from "@/components/products/ProductsClient";

export default function ProductsPage() {
  const title = "Shop Products | GR Shop";
  const description = "Browse our latest products and exclusive offers on GR Shop.";
  const url = "https://gr-shop-2.vercel.app/products";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />

        {/* OpenGraph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductsClient />
        </Suspense>
      </div>
    </>
  );
}
