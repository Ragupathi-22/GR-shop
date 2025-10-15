import Head from "next/head";
import HomeContent from "@/components/home/HomeContent";

export default function HomePage() {
  return (
    <>
<Head>
        <title>GR Shop | Best E-commerce Products</title>
        <meta
          name="description"
          content="Shop the latest products and best deals on GR Shop. Electronics, fashion, and more with fast shipping."
        />
        <link rel="canonical" href="https://gr-shop-2.vercel.app/" />

        {/* OpenGraph tags without image */}
        <meta property="og:title" content="GR Shop | Best E-commerce Products" />
        <meta
          property="og:description"
          content="Shop the latest products and best deals on GR Shop. Electronics, fashion, and more with fast shipping."
        />
        <meta property="og:url" content="https://gr-shop-2.vercel.app/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card tags without image */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="GR Shop | Best E-commerce Products" />
        <meta name="twitter:description" content="Shop the latest products and best deals on GR Shop." />
      </Head>
      <HomeContent />
    </>
  );
}
