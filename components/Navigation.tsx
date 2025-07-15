'use client';

import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-primary-200 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-accent-600 hover:text-accent-700 transition-colors duration-200">
              UnbiasedReviews
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              <Link 
                href="/" 
                className="text-primary-700 hover:text-accent-600 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Home
              </Link>
              <Link 
                href="/categories" 
                className="text-primary-700 hover:text-accent-600 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Categories
              </Link>
              <Link 
                href="/about" 
                className="text-primary-700 hover:text-accent-600 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-primary-700 hover:text-accent-600 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary-700 hover:text-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 p-2 rounded-lg transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-slide-up">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm border-t border-primary-200 shadow-medium">
            <Link 
              href="/" 
              className="text-primary-700 hover:text-accent-600 hover:bg-primary-50 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/categories" 
              className="text-primary-700 hover:text-accent-600 hover:bg-primary-50 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              href="/about" 
              className="text-primary-700 hover:text-accent-600 hover:bg-primary-50 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-primary-700 hover:text-accent-600 hover:bg-primary-50 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}