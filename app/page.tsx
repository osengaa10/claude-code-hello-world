import Link from "next/link";
import { getAllPostMeta } from "../lib/posts";

export default function Home() {
  const posts = getAllPostMeta();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-800 mb-6 leading-tight">
            Unbiased Product Reviews & 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-700"> Comparisons</span>
          </h1>
          <p className="text-xl text-primary-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Find the best tech products with our in-depth reviews and expert analysis. 
            Make informed decisions with honest recommendations you can trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center text-primary-600">
              <svg className="h-5 w-5 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No biased reviews
            </div>
            <div className="flex items-center text-primary-600">
              <svg className="h-5 w-5 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Expert analysis
            </div>
            <div className="flex items-center text-primary-600">
              <svg className="h-5 w-5 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Transparent recommendations
            </div>
          </div>
        </div>
      </div>

      {/* Latest Articles */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-primary-800 mb-2">Latest Reviews</h2>
            <p className="text-primary-600">Discover our newest product comparisons and reviews</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article key={post.slug} className="bg-white rounded-2xl shadow-soft border border-primary-200 overflow-hidden hover:shadow-medium transition-all duration-300 animate-slide-up group" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary-800 mb-3 leading-tight">
                  <Link href={`/${post.slug}`} className="hover:text-accent-600 transition-colors group-hover:text-accent-600">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-primary-800 mb-6 leading-relaxed">{post.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-500 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                  <Link 
                    href={`/${post.slug}`} 
                    className="text-accent-600 hover:text-accent-700 font-medium text-sm inline-flex items-center group-hover:translate-x-1 transition-all duration-200"
                  >
                    Read More 
                    <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-10 text-center border border-primary-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-primary-800 mb-4">
            Looking for Specific Product Recommendations?
          </h2>
          <p className="text-primary-600 mb-8 text-lg leading-relaxed">
            Browse our categories to find detailed comparisons and reviews for the products you need.
          </p>
          <Link 
            href="/categories" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-600 to-accent-700 text-white font-semibold rounded-xl hover:from-accent-700 hover:to-accent-800 transition-all duration-200 transform hover:scale-105 shadow-soft hover:shadow-medium"
          >
            Browse Categories
            <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
