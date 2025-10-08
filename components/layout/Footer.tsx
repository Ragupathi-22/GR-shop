// components/layout/Footer.tsx
import Link from "next/link";
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon, PhoneIcon, MailIcon, MapPinIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">GR Shop</h3>
            <p className="text-gray-300 mb-4">
              Your one-stop destination for the latest smartphones, laptops, and tech accessories.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <YoutubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/products?category=smartphones" className="text-gray-300 hover:text-white transition-colors">Smartphones</Link></li>
              <li><Link href="/products?category=laptops" className="text-gray-300 hover:text-white transition-colors">Laptops</Link></li>
              <li><Link href="/products?category=accessories" className="text-gray-300 hover:text-white transition-colors">Accessories</Link></li>
              <li><Link href="/products?category=wearables" className="text-gray-300 hover:text-white transition-colors">Wearables</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="h-5 w-5 mr-2 mt-0.5 text-gray-300" />
                <span className="text-gray-300">123 Tech Street, Silicon Valley, CA 94043</span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2 text-gray-300" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <MailIcon className="h-5 w-5 mr-2 text-gray-300" />
                <span className="text-gray-300">info@grshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} GR Shop. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors text-sm">Terms of Service</Link>
            <Link href="/shipping-policy" className="text-gray-300 hover:text-white transition-colors text-sm">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
