"use client";

import React from "react";
import Head from "next/head";

interface SEOHeadProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
  type?: string;
  schema?: Record<string, any>; // For structured data
}

export default function SEOHead({
  title,
  description = "Discover amazing products and offers at My Store.",
  image = "/default-product.jpg",
  url = "https://gr-shop-2.vercel.app",
  keywords = "shop, ecommerce, products, offers",
  type = "website",
  schema,
}: SEOHeadProps) {
  return (
    <Head>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  );
}
