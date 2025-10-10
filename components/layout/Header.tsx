// components/layout/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCartIcon, UserIcon, SearchIcon, MenuIcon, XIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-800 flex items-center">
            GR <span className="text-blue-600">Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors">Products</Link>
            <Link href="/cart" className="text-gray-600 hover:text-blue-600 transition-colors">Cart</Link>
            {/* <Link href="/products?category=laptops" className="text-gray-600 hover:text-blue-600 transition-colors">Laptops</Link> */}
          </nav>

          {/* Search, Cart, User Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>

            <Link href="/cart" className="text-gray-600 hover:text-blue-600 relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="text-gray-600 hover:text-blue-600 flex items-center space-x-1">
                  <UserIcon className="h-6 w-6" />
                 <span className="text-sm">{user?.name ? user.name : 'User'}</span>

                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Account</Link>
                  {/* <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link> */}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="text-gray-600 hover:text-blue-600 flex items-center space-x-1">
                <UserIcon className="h-6 w-6" />
                <span className="text-sm">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>

            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Products</Link>
              <Link href="/cart" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Cart</Link>
              {/* <Link href="/products?category=laptops" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Laptops</Link> */}
              {/* <Link href="/cart" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}> */}
                {/* <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link> */}

              {isAuthenticated ? (
                <>
                  <Link href="/account" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>My Account</Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Login</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
