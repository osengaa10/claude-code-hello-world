import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Affiliate Disclosure */}
      <div className="bg-gradient-to-r from-warning-500 to-warning-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-2">
            <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-center">
              <strong className="font-semibold">Affiliate Disclosure:</strong> This website contains affiliate links. 
              We may earn a commission when you make purchases through our links at no additional cost to you. 
              This helps support our content creation efforts.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-accent-400 mb-4">UnbiasedReviews</h3>
            <p className="text-primary-300 mb-4 leading-relaxed">
              Your trusted source for unbiased product reviews and comparisons. 
              We help you make informed decisions with expert analysis and honest recommendations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-400 hover:text-accent-400 transition-colors duration-200">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-primary-400 hover:text-accent-400 transition-colors duration-200">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-primary-400 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-primary-300 hover:text-accent-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary-300 hover:text-accent-400 transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-primary-300 hover:text-accent-400 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-primary-300 hover:text-accent-400 transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-primary-400 tracking-wider uppercase mb-4">
              Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/category/electronics" className="text-primary-300 hover:text-accent-400 transition-colors duration-200">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/category/power-stations" className="text-primary-300 hover:text-accent-400 transition-colors duration-200">
                  Power Stations
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="text-primary-300 hover:text-accent-400 transition-colors duration-200">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/category/tools" className="text-primary-300 hover:text-accent-400 transition-colors duration-200">
                  Tools
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-primary-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-400 text-sm">
              © {currentYear} UnbiasedReviews. All rights reserved.
            </p>
            <p className="text-primary-400 text-sm mt-2 md:mt-0">
              Built with Next.js • Hosted on Vercel
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}