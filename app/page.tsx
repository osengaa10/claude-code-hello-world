import Link from "next/link";
import { getAllPostMeta } from "../lib/posts";

export default function Home() {
  const posts = getAllPostMeta();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Unbiased Product Reviews & Comparisons
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find the best tech products with our in-depth reviews and expert analysis. 
          Make informed decisions with honest recommendations you can trust.
        </p>
      </div>

      {/* Latest Articles */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link href={`/${post.slug}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                  <Link 
                    href={`/${post.slug}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Looking for Specific Product Recommendations?
        </h2>
        <p className="text-gray-600 mb-6">
          Browse our categories to find detailed comparisons and reviews for the products you need.
        </p>
        <Link 
          href="/categories" 
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Browse Categories
        </Link>
      </div>
    </div>
  );
}
