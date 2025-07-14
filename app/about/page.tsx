import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Our Mission & Editorial Process",
  description: "Learn about BestTech Reviews, our editorial process, and how we provide unbiased product recommendations to help you make informed purchasing decisions.",
  keywords: "about us, editorial process, product testing, reviews methodology, affiliate disclosure",
  openGraph: {
    title: "About Us - Our Mission & Editorial Process",
    description: "Learn about BestTech Reviews, our editorial process, and how we provide unbiased product recommendations to help you make informed purchasing decisions.",
    type: "website",
  },
};

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About BestTech Reviews</h1>
        
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">Our Mission</h2>
          <p className="text-blue-800">
            To provide honest, unbiased product reviews and comparisons that help consumers make informed purchasing decisions. 
            We believe in transparency, thorough testing, and putting our readers' needs first.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
        <p className="text-gray-700 mb-6">
          BestTech Reviews is an independent product review website dedicated to helping consumers navigate the complex world of technology products. 
          Our team of experienced reviewers and researchers spend countless hours testing, analyzing, and comparing products to provide you with 
          the most accurate and helpful information possible.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Editorial Process</h2>
        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Research & Selection</h3>
              <p className="text-gray-700">We research market trends and consumer needs to identify products worth reviewing.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Hands-On Testing</h3>
              <p className="text-gray-700">We personally test products in real-world conditions to understand their performance.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Comparative Analysis</h3>
              <p className="text-gray-700">We compare products against competitors to provide context and value assessment.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Honest Reviews</h3>
              <p className="text-gray-700">We write comprehensive reviews highlighting both pros and cons of each product.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Transparency</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <h3 className="font-semibold text-yellow-900 mb-2">Affiliate Disclosure</h3>
          <p className="text-yellow-800">
            We participate in affiliate programs and may earn commissions from qualifying purchases made through our links. 
            This helps support our website and allows us to continue providing free, high-quality content. However, our editorial 
            opinions are never influenced by affiliate relationships. We only recommend products we genuinely believe in.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
        <p className="text-gray-700 mb-6">
          Have questions about our reviews or suggestions for products to test? We'd love to hear from you!
        </p>
        <div className="space-y-2">
          <p className="text-gray-700">
            <strong>Email:</strong> contact@besttech-reviews.com
          </p>
          <p className="text-gray-700">
            <strong>Editorial inquiries:</strong> editorial@besttech-reviews.com
          </p>
        </div>
      </div>
    </div>
  );
}