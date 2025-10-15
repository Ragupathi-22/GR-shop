export const metadata = {
  title: "GR Shop | Best E-commerce Products",
  description: "Shop the latest products and best deals on GR Shop. Electronics, fashion, and more with fast shipping.",
  alternates: {
    canonical: "https://gr-shop-2.vercel.app/",
  },
  openGraph: {
    title: "GR Shop | Best E-commerce Products",
    description: "Shop the latest products and best deals on GR Shop. Electronics, fashion, and more with fast shipping.",
    url: "https://gr-shop-2.vercel.app/",
    siteName: "GR Shop",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GR Shop | Best E-commerce Products",
    description: "Shop the latest products and best deals on GR Shop.",
  },
};


import HomeContent from "@/components/home/HomeContent";

export default function HomePage() {
  return <HomeContent />; 
}
