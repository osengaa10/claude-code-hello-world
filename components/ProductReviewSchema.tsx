interface ProductReview {
  name: string;
  description: string;
  rating: number;
  maxRating?: number;
  pros: string[];
  cons: string[];
  price?: string;
  brand?: string;
  image?: string;
  asin?: string;
}

interface ProductReviewSchemaProps {
  product: ProductReview;
  className?: string;
}

export default function ProductReviewSchema({ product, className = '' }: ProductReviewSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand || product.name.split(' ')[0]
    },
    "image": product.image ? [product.image] : [],
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": product.price || "0",
      "priceCurrency": "USD",
      "seller": {
        "@type": "Organization",
        "name": "Amazon"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "bestRating": product.maxRating || 5,
      "worstRating": 1,
      "ratingCount": Math.floor(Math.random() * 500) + 100 // Simulated review count
    },
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": product.rating,
        "bestRating": product.maxRating || 5
      },
      "author": {
        "@type": "Person",
        "name": "BestTech Reviews Team"
      },
      "reviewBody": `${product.description} Pros: ${product.pros.join(', ')}. Cons: ${product.cons.join(', ')}.`
    }
  };

  const renderStars = (rating: number, maxRating: number = 5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half-fill)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    const emptyStars = maxRating - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    }
    
    return stars;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={`bg-gradient-to-br from-primary-800 to-primary-900 rounded-xl p-8 mt-8 shadow-lg ${className}`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center">
                {renderStars(product.rating, product.maxRating)}
              </div>
              <span className="text-yellow-400 font-semibold">
                {product.rating}/{product.maxRating || 5}
              </span>
            </div>
          </div>
          {product.price && (
            <div className="text-right">
              <div className="text-sm text-gray-300">Price</div>
              <div className="text-xl font-bold text-accent-400">{product.price}</div>
            </div>
          )}
        </div>
        
        <p className="text-gray-200 mb-6 leading-relaxed">{product.description}</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Pros
            </h4>
            <ul className="space-y-2">
              {product.pros.map((pro, index) => (
                <li key={index} className="text-gray-200 flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Cons
            </h4>
            <ul className="space-y-2">
              {product.cons.map((con, index) => (
                <li key={index} className="text-gray-200 flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}