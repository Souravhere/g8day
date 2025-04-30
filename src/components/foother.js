"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Twitter, 
  MessageCircle, 
  MessageSquare, 
  BookOpen 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Tagline Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-2">
              {/* Replace with your actual logo */}
              <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-2">
                G8
              </div>
              <span className="text-2xl font-bold">G8Day</span>
            </div>
            <p className="text-gray-400 text-sm">Your Destiny. Decentralized.</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col items-center md:items-start md:justify-center">
            <ul className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
              <li>
                <Link href="/" className="hover:text-red-500 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-red-500 transition-colors duration-200">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/dao" className="hover:text-red-500 transition-colors duration-200">
                  DAO
                </Link>
              </li>
              <li>
                <Link href="/token" className="hover:text-red-500 transition-colors duration-200">
                  Token
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-500 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social Media Icons */}
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/g8day" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a 
                href="https://t.me/g8day" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                aria-label="Telegram"
              >
                <MessageCircle size={24} />
              </a>
              <a 
                href="https://discord.gg/g8day" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                aria-label="Discord"
              >
                <MessageSquare size={24} />
              </a>
              <a 
                href="https://medium.com/g8day" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                aria-label="Medium"
              >
                <BookOpen size={24} />
              </a>
            </div>

            <div className="mt-6">
              <Link 
                href="/fortune" 
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-full transition-colors duration-200"
              >
                Get Your Fortune
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section with Copyright */}
        <div className="border-t border-gray-800 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2025 G8Day. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;