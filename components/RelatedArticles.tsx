import Link from 'next/link';
import { getRelatedPosts } from '@/lib/internal-linking';
import type { PostMeta } from '@/lib/posts';

interface RelatedArticlesProps {
  currentPostSlug: string;
  limit?: number;
  showImages?: boolean;
  className?: string;
}

export default function RelatedArticles({
  currentPostSlug,
  limit = 3,
  showImages = true,
  className = ''
}: RelatedArticlesProps) {
  const relatedPosts = getRelatedPosts(currentPostSlug, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedPosts.map((post) => (
          <RelatedArticleCard
            key={post.slug}
            post={post}
            showImage={showImages}
          />
        ))}
      </div>
    </div>
  );
}

interface RelatedArticleCardProps {
  post: PostMeta;
  showImage?: boolean;
}

function RelatedArticleCard({ post, showImage = true }: RelatedArticleCardProps) {
  return (
    <Link href={`/${post.slug}`} className="group">
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {showImage && post.featured_image && (
          <div className="aspect-video bg-gray-100">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        <div className="p-4">
          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h4>
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {post.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{new Date(post.date).toLocaleDateString()}</span>
            {post.category && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {post.category.replace('-', ' ')}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

// Horizontal related articles variant
export function RelatedArticlesHorizontal({
  currentPostSlug,
  limit = 4,
  className = ''
}: RelatedArticlesProps) {
  const relatedPosts = getRelatedPosts(currentPostSlug, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className={`border-t border-gray-200 pt-8 ${className}`}>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedPosts.map((post) => (
          <Link key={post.slug} href={`/${post.slug}`} className="group">
            <article className="flex space-x-4 hover:bg-gray-50 p-4 rounded-lg transition-colors">
              {post.featured_image && (
                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  {post.category && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{post.category.replace('-', ' ')}</span>
                    </>
                  )}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Sidebar related articles variant
export function RelatedArticlesSidebar({
  currentPostSlug,
  limit = 5,
  className = ''
}: RelatedArticlesProps) {
  const relatedPosts = getRelatedPosts(currentPostSlug, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Related Articles</h3>
      <div className="space-y-4">
        {relatedPosts.map((post) => (
          <Link key={post.slug} href={`/${post.slug}`} className="group block">
            <article className="flex space-x-3 hover:bg-gray-50 p-2 rounded transition-colors">
              {post.featured_image && (
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}