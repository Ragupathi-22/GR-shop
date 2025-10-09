// app/layout.tsx
import type { Metadata } from "next";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Ecommerce Store",
  description: "Built with Next.js and WooCommerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster position="bottom-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
