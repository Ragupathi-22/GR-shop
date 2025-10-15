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

  const fullImageUrl = image.startsWith('http') ? image : `${url}${image}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content="index, follow" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="My Store" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={url} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      {/* Optional: add your Twitter handle */}
      {/* <meta name="twitter:site" content="@yourhandle" /> */}
      {/* <meta name="twitter:creator" content="@yourhandle" /> */}

      {/* Structured Data */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  );
}
