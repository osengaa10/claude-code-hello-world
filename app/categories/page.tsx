import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPostMeta } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Product Categories - Browse All Reviews',
  description: 'Browse all product categories and find the best reviews, comparisons, and buying guides for electronics, power stations, accessories, and more.',
  keywords: 'product categories, electronics reviews, power stations, accessories, buying guides',
  openGraph: {
    title: 'Product Categories - Browse All Reviews',
    description: 'Browse all product categories and find the best reviews, comparisons, and buying guides for electronics, power stations, accessories, and more.',
    type: 'website',
  },
};

export default function CategoriesPage() {
  const posts = getAllPostMeta();
  
  // Group posts by category
  const postsByCategory = posts.reduce((acc, post) => {
    if (!post.category) return acc;
    
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  // Sort categories by post count
  const sortedCategories = Object.entries(postsByCategory)
    .sort(([, a], [, b]) => b.length - a.length);

  const getCategoryDescription = (category: string) => {
    const descriptions: Record<string, string> = {
      'power-stations': 'Portable power stations and solar generators for camping, emergencies, and outdoor adventures',
      'power-banks': 'Portable chargers and power banks for phones, laptops, and mobile devices',
      'electronics': 'Consumer electronics, gadgets, and tech accessories',
      'accessories': 'Cables, adapters, and accessories for electronic devices',
      'tools': 'Power tools, hand tools, and workshop equipment',
      'outdoor': 'Outdoor gear, camping equipment, and survival tools',
      'home': 'Home automation, smart devices, and household electronics',
      'automotive': 'Car accessories, tools, and automotive electronics',
    };
    
    return descriptions[category] || `Reviews and comparisons for ${category.replace('-', ' ')} products`;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.JSX.Element> = {
      'power-stations': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      'power-banks': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      'electronics': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      'accessories': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      'tools': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    };
    
    return icons[category] || (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Product Categories
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Browse our comprehensive collection of product reviews, comparisons, and buying guides 
          organized by category to help you find exactly what you're looking for.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {sortedCategories.map(([category, categoryPosts]) => {
          const categoryName = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
          const recentPosts = categoryPosts.slice(0, 3);
          
          return (
            <div key={category} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {getCategoryIcon(category)}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {categoryName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {categoryPosts.length} {categoryPosts.length === 1 ? 'article' : 'articles'}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">
                  {getCategoryDescription(category)}
                </p>
                
                {/* Recent articles */}
                <div className="space-y-2 mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Recent Articles:</h3>
                  {recentPosts.map((post, index) => (
                    <Link
                      key={index}
                      href={`/${post.slug}`}
                      className="block text-sm text-blue-600 hover:text-blue-800 truncate"
                    >
                      • {post.title}
                    </Link>
                  ))}
                </div>
                
                <Link
                  href={`/category/${category}`}
                  className="inline-flex items-center w-full justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View All {categoryName}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Can't Find What You're Looking For?
        </h2>
        <p className="text-gray-600 mb-6">
          We're always adding new product categories and reviews. If you have a specific product 
          or category you'd like us to cover, let us know!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Request a Review
          </Link>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-md border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Browse All Articles
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{posts.length}</div>
          <div className="text-sm text-gray-600">Total Articles</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{sortedCategories.length}</div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">
            {posts.reduce((acc, post) => acc + (post.tags?.length || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Total Tags</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">
            {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
          <div className="text-sm text-gray-600">Last Updated</div>
        </div>
      </div>
    </div>
  );
}