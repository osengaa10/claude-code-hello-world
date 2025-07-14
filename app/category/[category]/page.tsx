import { Metadata } from 'next';
import Link from 'next/link';
import { getPostsByCategory } from '@/lib/internal-linking';
import { getAllPostMeta } from '@/lib/posts';

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categoryName = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${categoryName} Reviews & Comparisons`,
    description: `Browse all ${categoryName.toLowerCase()} reviews, comparisons, and buying guides. Find the best ${categoryName.toLowerCase()} products with our expert analysis.`,
    keywords: `${categoryName}, reviews, comparisons, buying guide, best ${categoryName.toLowerCase()}`,
    openGraph: {
      title: `${categoryName} Reviews & Comparisons`,
      description: `Browse all ${categoryName.toLowerCase()} reviews, comparisons, and buying guides. Find the best ${categoryName.toLowerCase()} products with our expert analysis.`,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPostMeta();
  const categories = [...new Set(posts.map(post => post.category).filter(Boolean))];
  
  return categories.map(category => ({
    category: category!,
  }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  const categoryName = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  if (posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {categoryName} Reviews
          </h1>
          <p className="text-gray-600 mb-8">
            No articles found in this category yet. Check back soon for new content!
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">Categories</span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-900">{categoryName}</span>
              </div>
            </li>
          </ol>
        </nav>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {categoryName} Reviews & Comparisons
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Discover the best {categoryName.toLowerCase()} products with our comprehensive reviews, 
          detailed comparisons, and expert buying guides. Make informed decisions with our honest analysis.
        </p>
      </div>

      {/* Stats */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-blue-900">
              {posts.length} {categoryName} {posts.length === 1 ? 'Article' : 'Articles'}
            </h2>
            <p className="text-blue-700">
              Updated regularly with the latest products and reviews
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
            <div className="text-sm text-blue-700">Reviews</div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {post.featured_image && (
              <div className="aspect-video bg-gray-100">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                <Link href={`/${post.slug}`} className="hover:text-blue-600 transition-colors">
                  {post.title}
                </Link>
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex space-x-1">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-gray-400 text-xs">+{post.tags.length - 2} more</span>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Link
                  href={`/${post.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read Full Review
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Category Footer */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          About Our {categoryName} Reviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Analysis</h3>
            <p className="text-gray-600">
              Our team of experts thoroughly tests and evaluates each {categoryName.toLowerCase()} product 
              to provide you with honest, unbiased reviews and recommendations.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Updated Content</h3>
            <p className="text-gray-600">
              We regularly update our reviews with the latest product information, pricing changes, 
              and new releases to ensure you have the most current information.
            </p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Looking for a specific {categoryName.toLowerCase()} product? 
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 ml-1">
              Contact us
            </Link> 
            {' '}and we'll consider reviewing it.
          </p>
        </div>
      </div>
    </div>
  );
}